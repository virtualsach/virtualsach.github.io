---
title: "Cut Provisioning Time by 90%: Zero-Touch NSX-T Automation"
date: 2021-04-10
description: "Architected a fully automated private cloud for a Financial Services giant, reducing tenant provisioning time from 10 days to 4 hours using Ansible and NSX-T."
summary: "Zero-Touch Provisioning pipeline for NSX-T using vRA and Ansible."
role: "Principal Cloud Architect"
tags: ["nsx-t", "automation", "ansible", "private-cloud", "architecture", "case-study"]
---

> "Configuration drift was rampant. 'Tenant A' had different security policies than 'Tenant B' due to manual copy-paste errors."

# The Challenge

Our client, a major **Financial Services Institution**, was facing a scalability crisis. They needed to deploy isolated "Tenant Pods" for different business units.

Each pod required a full stack of networking:

* **Tier-0 Gateways**
* **Tier-1 Gateways**
* **Segments**
* Strict **Distributed Firewall** rules

**The Status Quo:**

* **Manual Effort:** It took 2 senior engineers **2 weeks** to manually click through the UI to provision one pod.
* **Human Error:** Configuration drift was rampant.
* **Compliance Risk:** Auditors could not verify if the deployed infrastructure matched the approved design.

---

# The Solution

I architected a **Zero-Touch Provisioning (ZTP)** pipeline. We moved away from "ClickOps" to a fully declarative model.

## Tech Stack

* **Core Network:** VMware **NSX-T Data Center**
* **Orchestration:** **vRealize Automation (vRA)**
* **Configuration Management:** **Ansible** (with `vmware.ansible_nsxt` collection)
* **Scripting:** **PowerCLI** for Day 2 operations

## Technical Deep Dive

We defined the "Golden State" of a Tenant Network in **YAML**.

When a new business unit requested a pod, **vRA** triggered an **Ansible** job that:

1. Created the **Tier-1 Gateway**.
2. Attached it to the **Tier-0 VRF**.
3. Provisioned the Subnets.
4. Applied the "Baseline Security Policy" (**Zero Trust**).

### Architecture Diagram

```mermaid
graph TD
    User[Self-Service Portal] -->|Request Pod| vRA[vRealize Automation]
    vRA -->|Trigger| Ansible[Ansible Tower]
    Ansible -->|Pull Config| Git[Git Repo (YAML definitions)]
    Ansible -->|API Calls| NSX[NSX-T Manager]
    
    subgraph NSX-T Fabric
    NSX -->|Create| T1[Tier-1 Gateway]
    NSX -->|Create| Seg[Segments / VXLAN]
    NSX -->|Apply| DFW[Distributed Firewall Rules]
    end
```

# Business Impact

* **Velocity:** Provisioning time dropped from **10 days to 4 hours**.
* **Reliability:** Eliminated configuration drift. Every pod was **mathematically identical**.
* **Compliance:** Achieved **100% Audit Pass Rate**. The auditors didn't check the live environment; they checked the **Git commit history**.
