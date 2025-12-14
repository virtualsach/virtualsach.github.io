---
title: "The 'State File' Disaster: Why Remote State Locking Matters"
pubDate: 2020-11-22
description: "If you are running Terraform from your laptop, you are one typo away from deleting production."
author: "Virtual Sachin"
tags: ["DevOps", "Terraform", "Automation", "Azure"]
---

> "If you are running Terraform from your laptop, you are one typo away from deleting production."

## The Scenario

**Date:** November 22, 2020  
**Context:** Systems Integration Advisor Era (NTT Data)

It was a Tuesday morning that felt like a Friday afternoon. Two capable engineers were working on the same Azure application stack. One was adding a new subnet; the other was updating a Virtual Machine scale set size.

They both ran `terraform apply` from their local terminals, roughly at the same time.

Within seconds, the Slack channel lit up. "Why did the load balancer just disappear?"

## The Reality Check

We were managing our Infrastructure as Code (IaC), but we weren't managing our **state**. Both engineers were using a local `terraform.tfstate` file, or a shared file that lacked locking mechanisms.

When Engineer A's process started, it read the state. When Engineer B's process started, it read the *same* state. When A finished, the state was updated. When B finished, they unknowingly overwrote A's update with an outdated view of the world.

The result? Terraform lost track of about 200 cloud resources. It assumed they didn't exist anymore or were drifted, leading to chaotic remediation plans that destroyed valid infrastructure.

## The Solution

We declared a moratorium on "Laptop Ops." The fix was twofold: **Remote State** and **State Locking**.

We migrated the backend to an **Azure Storage Account**.

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "sttfstate001"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
```

Crucially, Azure Storage supports **Blob Leases**. When a pipeline (or user) runs `terraform plan` or `apply`, Terraform acquires a lease (lock) on the state blob. If a second engineer tries to run a command, Terraform fails instantly with: `Error acquiring the state lock`.

We took it a step further and moved execution entirely to **Azure DevOps Pipelines**. Now, humans write code, but only the Service Principal, controlled by the pipeline, touches the state file.

### Key Takeaway

**State is the single source of truth.** Treat your `tfstate` file with more reverence than your production database. If you lose your database, you have backups. If you corrupt your Terraform state, you have an orphan infrastructure that is now unmanageable.
