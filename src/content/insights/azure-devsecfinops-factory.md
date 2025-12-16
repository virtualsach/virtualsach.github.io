---
title: "The Factory: Building Azure DevSecFinOps at Scale"
date: 2025-02-14
draft: false
tags: ["Azure", "Terraform", "DevSecOps", "Factory Pattern", "Architecture"]
summary: "We faced a 'death sentence': deploy 10+ geo-redundant regions in one month. The only way out was to stop writing Terraform and start building a Factory. Here is the engineering deep-dive."
---

> **The Problem:** "We need to deploy 10 new regions next month."
>
> In the world of traditional infrastructure, this sentence is a death sentence. It typically means 30 days of copy-pasting code, drift, and manual "click-ops" to fix the gaps.

At **Kyndryl**, facing this exact challenge for a global banking client, we realized that "writing Terraform" was the bottleneck. We needed a paradigm shift. We didn't just automate the infrastructure; we built a **Factory**.

## The Philosophy: Engine vs. Fuel

Most engineering teams struggle with IaC scaling because they mix their **Logic** (Terraform Resource Blocks) with their **Data** (Variables/TFVars). When a new region is needed, they copy the entire folder structure, effectively forking their own codebase.

We adopted a manufacturing principle: **The Engine (Code) must be immutable. The Fuel (Data) defines the output.**

* **The Engine:** A set of generic, hardened Terraform Modules (`modules/network`, `modules/aks`).
* **The Fuel:** A single, human-readable YAML Configuration file (`config.yaml`).
* **The Product:** A fully compliant, secure Azure Landing Zone.

## 2. Core Components

### The Single Source of Truth (`config.yaml`)

We banished `.tfvars` files. They are developer-centric and hard to validate structurally. Instead, we used YAML, which allows us to define nested structures (Spokes -> Subnets -> NSGs) in a way that visibly maps to the topology.

```yaml
# config.yaml - The "Order" for the Factory
environment: "prod-eus-001"
region: "eastus"

# The Factory iterates over this list
spokes:
  app01:
    cidr: "10.11.0.0/23"
    peering: true
    subnets:
      web: { cidr: "10.11.0.0/26", nsg: "strict-web" }
      db:  { cidr: "10.11.0.64/26", nsg: "strict-db" }
```

### The Engine (`main.tf`)

Our `main.tf` became incredibly boring—and that's the goal. It contains almost no logic. It simply reads the YAML and feeds it into the modules.

```hcl
# main.tf - The Assembly Line
locals {
  config = yamldecode(file("${path.module}/config.yaml"))
}

module "spokes" {
  for_each = local.config.spokes
  source   = "./modules/spoke-network"

  name           = each.key
  address_space  = each.value.cidr
  security_level = each.value.subnets.nsg
}
```

## 3. The Architecture

We realized that "Security" and "Finance" (Tagging) could not be afterthoughts. They had to be part of the assembly line.

<pre class="mermaid">
graph TD
    subgraph Factory_Inputs
        YAML[config.yaml]
        TF[Modules/Engine]
    end

    subgraph Assembly_Line
        Valid[Validation Layer]
        Sec[Security Injection]
        Fin[Cost Tagging]
    end

    subgraph Output_Azure
        Hub[Hub VNet]
        Spoke[Spoke VNets]
        NVA[Palo Alto NVA]
    end

    YAML --> Valid
    TF --> Valid
    Valid --> Sec
    Sec --> Fin
    Fin --> Hub
    Fin --> Spoke
    Hub --> NVA

    %% Brand Styles - "Cyber-Glass"
    classDef input fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff,stroke-dasharray: 5 5;
    classDef process fill:#1e1b4b,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef azure fill:#172554,stroke:#3b82f6,stroke-width:2px,color:#fff;

    class YAML,TF input;
    class Valid,Sec,Fin process;
    class Hub,Spoke,NVA azure;

    linkStyle default stroke:#94a3b8,stroke-width:2px;
</pre>

## 4. The "DevSecFinOps" Trinity

This Factory approach allowed us to solve three problems simultaneously:

### 1. Security (Dev**Sec**Ops)

We embedded **Palo Alto NVA** requirements into the `hub-network` module. A developer *cannot* deploy a Hub without the NVA, because the module requires the NVA parameters to function. Security is no longer a policy; it's a dependency.

### 2. Finance (DevSec**Fin**Ops)

We mandated that the `config.yaml` must contain a `cost_center` key. The Terraform `locals` block merges this tag into `default_tags`. Every single resource—from a VM to a public IP—inherits this tag. We achieved **100% Cost Visibility** overnight.

### 3. Operations (DevSecFin**Ops**)

When we needed those 10 regions, we didn't write code. We wrote a script to generate 10 unique `config.yaml` files. The deployment took 4 hours.

## Key Takeaway

If you find yourself writing the same `resource "azurerm_virtual_network"` block more than twice, stop. You aren't engineering; you're typing.

**Build a Factory.** Move the complexity into the Engine, keep the Fuel simple, and let the assembly line handle the scale.
