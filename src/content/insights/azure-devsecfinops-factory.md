---
title: "The Factory: Building Azure DevSecFinOps at Scale"
date: 2025-02-14
draft: false
tags: ["Azure", "Terraform", "DevSecOps", "Factory Pattern", "Architecture"]
summary: "How do you deploy 10+ geo-redundant regions in days, not months? You move from 'Scripting' to 'Module Factories'. Here is the blueprint for our data-driven Terraform engine."
---

> "We need to deploy 10 new regions next month."
>
> In the world of traditional infrastructure, this sentence is a death sentence. It means late nights, copy-pasting code, and drift.

To solve this at scale, we didn't just write Terraform; we built a **Factory**.

## The Philosophy: Engine vs. Fuel

Most engineering teams struggle because they mix their **Logic** (Terraform) with their **Data** (Variables). When a new region is needed, they copy the entire folder structure.

We took a different approach based on a simple manufacturing principle: **The Factory (Engine) should not change just because the Order (Fuel) changes.**

* **The Engine:** Generic, immutable Terraform Modules (`terraform/modules/`).
* **The Fuel:** A simple YAML Configuration file (`config.yaml`).
* **The Product:** A fully compliant Azure Landing Zone.

---

## 2. Core Components

### The Single Source of Truth (`config.yaml`)

We banished `.tfvars` files. They are too developer-centric. Instead, we use a human-readable YAML file that even a Project Manager could (theoretically) edit.

```yaml
# Define the environment once
environment: "prod-eus-001"

# Define networks dynamically
spokes:
  app01:
    address_space: ["10.11.0.0/23"]
    subnets:
      web: { address_prefixes: ["10.11.0.0/26"] }
      db:  { address_prefixes: ["10.11.0.64/26"] }
```

### The Engine (`main.tf`)

Our `main.tf` is surprisingly boring. It doesn't define resources; it defines **iterators**. It reads the YAML and spins up the factories.

```hcl
locals {
  config = yamldecode(file("${path.module}/config.yaml"))
}

module "spokes" {
  for_each = local.config.spokes
  source   = "./modules/spoke-network"
  # ...
}
```

---

## 3. The Payoff: Why we use this

When the requirement came to add those 10 regions, we didn't write 10 new Terraform projects. We generated 10 new `config.yaml` files.

1. **Scale:** Add 50 Spoke VNets by adding 50 lines of YAML, not 500 lines of HCL.
2. **Safety:** Junior engineers edit `config.yaml`, not complex Terraform logic.
3. **Governance:** Security standards (Palo Alto NVA, NSGs) are baked into the modules. You strictly cannot deploy an "insecure" VNet because the module doesn't support it.

### Key Takeaway

If you are writing the same `resource "azurerm_virtual_network"` block more than twice, you aren't engineering—you're typing. Build a Factory instead.
