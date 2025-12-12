---
title: "Hardware vs. Software: The F5 to NSX Edge Migration"
date: 2018-08-22
description: "The client wanted to save money by retiring physical F5 hardware and using the built-in NSX Edge load balancer. We learned the hard way that 'Software Defined' doesn't mean 'Feature Complete'."
draft: false
tags: ["nsx", "f5", "load-balancing", "migration", "ibm", "architecture"]
---

> "The CFO had a great idea: 'Why are we paying huge support contracts for these physical F5 boxes when NSX comes with a free Load Balancer?'"

It was August 2018. It sounded logical. We were already paying for **NSX Enterprise**.

We started the migration planning. And then we hit the wall.

---

# The Reality Check: Feature Parity

The **F5 LTM** is a mature, ASIC-driven beast. The **NSX Edge** (at the time) was a virtual appliance based on HAProxy.

| Feature | F5 LTM (Hardware) | NSX Edge ESG (Software) |
| :--- | :--- | :--- |
| **Logic** | **iRules** (Tcl) - Powerful | **App Rules** (HAProxy) - Limited |
| **Throughput** | 40Gbps+ (Line Rate) | ~2-4Gbps (CPU Bound) |
| **WAF** | Advanced ASM Module | Basic RegEx checks |

# The Workaround: Rewrite at the Source

The client had complex iRules for URI redirection. The NSX Edge couldn't do it dynamically.

**The Solution:**
We rewrote the application logic **at the Web Server level** (Nginx/Apache). It was efficient, but it decentralized our config management.

## The Throughput: ECMP Scaling

The ESG CPU spiked to **100%** at just 4Gbps of traffic.

We scaled horizontally using **ECMP (Equal-Cost Multi-Path)**. We deployed 4 active Edge Gateways in parallel, announcing the same VIP via BGP. This gave us ~16Gbps aggregate throughput.

### Key Takeaway

**Software Defined Networking is flexible, but it isn't always feature-complete.**

Cost savings on hardware often translate to increased cost in engineering hours. We saved the F5 renewal cost, but we spent 3 months re-architecting the web tier.
