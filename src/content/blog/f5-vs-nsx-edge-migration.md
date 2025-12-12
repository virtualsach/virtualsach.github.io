---
title: "Hardware vs. Software: The F5 to NSX Edge Migration"
date: 2018-08-22
description: "The client wanted to save money by retiring physical F5 hardware and using the built-in NSX Edge load balancer. We learned the hard way that 'Software Defined' doesn't mean 'Feature Complete'."
draft: false
tags: ["nsx", "f5", "load-balancing", "migration", "ibm", "architecture"]
---

It was August 2018. The CFO had a great idea: *"Why are we paying huge support contracts for these physical F5 boxes when NSX comes with a free Load Balancer?"*

It sounded logical. We were already paying for NSX Enterprise. Why not use the **Edge Services Gateway (ESG)** for load balancing?

We started the migration planning. And then we hit the wall.

## The Reality Check: Feature Parity

The F5 LTM is a mature, ASIC-driven beast. The NSX Edge (at the time) was a virtual appliance based on HAProxy. They were not the same.

| Feature | F5 LTM (Hardware) | NSX Edge ESG (Software) |
| :--- | :--- | :--- |
| **Logic** | iRules (Tcl) - Extremely powerful | Application Rules (HAProxy ACLs) - Limited |
| **Persistence** | Cookie, Source IP, Universal, SSL ID, Hash | Cookie, Source IP, SSL ID |
| **Throughput** | 40Gbps+ (Line rate) | ~2-4Gbps (CPU bound) |
| **WAF** | Advanced ASM Module | Basic RegEx checks |

## The Workaround: Rewrite at the Source

The client had complex iRules for URI redirection (e.g., rewriting `/store` to `/shop` based on User-Agent). The NSX Edge couldn't do it dynamically.

We had two choices:

1. Cancel the project (Not an option).
2. Move the logic.

We ended up rewriting the application logic **at the Web Server level**. We configured Nginx and Apache on the backend pool members to handle the redirects that the F5 used to do. It was efficient, but it meant decentralized config management.

## The Throughput: ECMP Scaling

Then came user testing. The ESG CPU spiked to 100% at just 4Gbps of traffic. It choked.

We couldn't vertically scale the VM anymore. So we scaled horizontally using **ECMP (Equal-Cost Multi-Path)**. We deployed 4 active Edge Gateways in parallel, announcing the same VIP via BGP. This distributed the load, giving us an aggregate throughput of ~16Gbps.

## The Lesson

**Software Defined Networking is flexible, but it isn't always feature-complete compared to dedicated ASICs.**

Cost savings on hardware often translate to increased cost in engineering hours. We saved the F5 renewal cost, but we spent 3 months re-architecting the web tier.
