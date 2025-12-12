---
title: "The Great Migration: Moving Production from NSX-V to NSX-T"
date: 2021-01-20
description: "Upgrading infrastructure is like changing the engines on a plane while flying. Here is how we moved a financial client from legacy NSX-V to NSX-T without dropping the banking app."
draft: false
tags: ["nsx-v", "nsx-t", "migration", "ntt-data", "infrastructure", "banking"]
---

It was January 2021. The clock was ticking. Support for NSX-V (the vSphere-only version of software-defined networking) was ending.

Our client, a major financial institution, was running their core banking platform on it. We had to migrate them to NSX-T (Transformers). This wasn't just an upgrade; it was a completely different operating system.

## The Architectural Shift

The first shock was the Control Plane.

* **NSX-V**: Relying on separate "Manager" and "Controller" appliances. If the Controllers desynchronized (which happened often), the data plane got jittery.
* **NSX-T**: A specific "Unified Appliance" cluster setup. The Management and Control planes were converged. It was more robust, but it required a complete redesign of the management vLANs.

## The Data Plane: VXLAN vs. Geneve

Then there was the encapsulation. NSX-V used **VXLAN** (Standard). NSX-T used **Geneve** (Flexible).

Why? Containers.
VXLAN has a fixed header size. It can't carry metadata. Geneve allows for variable-length options (TLV). This mattered because the bank was planning to move to Kubernetes. NSX-T needed to insert "Container Context" (Pod Name, Namespace) into the packet header so the Distributed Firewall could enforce rules based on app identity, not just IP.

## The Execution: Lift and Shift vs. In-Place

We had two choices:

1. **Lift and Shift (HCX)**: Build a new NSX-T greenfield and migrate VMs over.
2. **In-Place (Migration Coordinator)**: Use VMware's tool to convert the running config.

We chose the **Migration Coordinator** because we didn't have spare hardware.

## The Challenge: The Edge Cluster

The hardest part was the **Edge Cluster (North-South Routing)**.
In NSX-V, the Edges were VMs. In NSX-T, the Edge Nodes are DPDK-accelerated monsters.

We had to bridge the existing VLANs to the new Edge Nodes. The routing cutover was the most nerve-wracking moment of my life. We had to shut down the OSPF adjacencies on the Old Edges and bring up BGP peering on the New Edges within a 15-minute maintenance window.

## The Lesson

**Upgrading infrastructure is like changing the engines on a plane while flying.**
You need redundancy, you need a rollback plan, and you need nerves of steel. The migration was successful, but I definitely aged a few years that weekend.
