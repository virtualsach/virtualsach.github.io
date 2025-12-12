---
title: "The Great Migration: Moving Production from NSX-V to NSX-T"
date: 2021-01-20
description: "Upgrading infrastructure is like changing the engines on a plane while flying. Here is how we moved a financial client from legacy NSX-V to NSX-T without dropping the banking app."
draft: false
tags: ["nsx-v", "nsx-t", "migration", "ntt-data", "infrastructure", "banking"]
---

> "Upgrading infrastructure is like changing the engines on a plane while flying. You need redundancy, a rollback plan, and nerves of steel."

It was January 2021. Support for **NSX-V** was ending.
We had to migrate a major financial institution to **NSX-T**.

# The Architectural Shift

* **NSX-V**: VXLAN. Separate Controllers. Fragile.
* **NSX-T**: Geneve. Unified Appliance. Container-ready.

**Why Geneve?** It supports Variable Length Options (TLV), allowing us to stuff "Container Context" (Pod Name) into the packet header.

---

# The Execution

We chose the **Migration Coordinator** tool (In-Place) because we lacked spare hardware.

## The Challenge: Edge Cluster

The hardest part was the **Edge Cluster (North-South Routing)**.
We had to bridge existing VLANs to new Edge Nodes.

**The Cutover:**
We shut down OSPF on the Old Edges and brought up BGP on the New Edges within a **15-minute window**.

### Key Takeaway

**Architecture is evolution.**

The migration was successful, but I aged a few years that weekend. Always have a rollback plan.
