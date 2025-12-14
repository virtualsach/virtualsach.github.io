---
title: "The Transitive Routing Trap: Why VNet Peering Isn't Enough"
pubDate: 2021-08-15
description: "Peering connects networks; Appliances connect applications. You cannot build a star topology without a router in the middle."
author: "Virtual Sachin"
tags: ["Azure", "Networking", "Architecture", "Firewall"]
---

> "Peering connects networks; Appliances connect applications. You cannot build a star topology without a router in the middle."

## The Scenario

**Date:** August 15, 2021  
**Context:** Cloud Architect Era (NTT Data)

We were deploying a classic **Hub-and-Spoke** topology for a large financial services client. The design seemed simple enough: a central "Hub" VNet for shared services (Domain Controllers, ExpressRoute) and multiple "Spoke" VNets for different application workloads.

To connect them, we used **VNet Peering**, the gold standard for high-bandwidth, low-latency connectivity in Azure.

* **Peering 1:** Hub <-> Spoke A
* **Peering 2:** Hub <-> Spoke B

The assumption? Since Spoke A is connected to the Hub, and Spoke B is connected to the Hub, Spoke A should be able to talk to Spoke B.

## The Reality Check

They couldn't. Packets initiated from a VM in Spoke A destined for Spoke B simply vanished.

The root cause wasn't a firewall rule or an NSG. It was a fundamental property of Azure networking that often trips up engineers moving from on-prem MPLS clouds: **VNet Peering is non-transitive.**

In the physical world, if I plug Router A into Router B, and Router B into Router C, and run OSPF, A and C can talk. In Azure, VNet Peering acts more like a patch cable. It connects exactly two endpoints. It does not advertise routes transitively.

## The Solution

To make a Hub-and-Spoke topology actually work like a star network, you need a router in the middle. We had to introduce an **NVA (Network Virtual Appliance)**—in this case, Azure Firewall—into the Hub VNet.

**The Fix involved two steps:**

1. **Deploy Azure Firewall**: Placed in the Hub VNet to act as the central routing hop.
2. **User Defined Routes (UDRs)**: We successfully "tricked" the Azure SDN by creating route tables attached to every subnet in Spoke A and Spoke B.

```bash
# Concept of the UDR applied to Spoke Subnets
Route Name: To-Spokes
Address Prefix: 10.0.0.0/8 (Supernet of all Spokes)
Next Hop Type: Virtual Appliance
Next Hop IP: 10.1.0.4 (Internal IP of Azure Firewall)
```

By forcing traffic destined for other spokes to go *through* the firewall, we not only enabled connectivity but also gained centralized inspection and logging.

### Key Takeaway

**Cloud networking mimics physical networking, but the rules of physics are different.** Never assume transitivity in cloud peering. If you need A to talk to C via B, B must be an active routing device, not just a passive network conduit.
