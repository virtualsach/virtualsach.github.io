---
title: "BGP Attributes: Using Local Pref to Save Bandwidth Costs"
date: 2014-01-20T09:00:00+05:30
draft: false
tags: ["Networking", "BGP", "ISP", "Cost Optimization", "Career"]
summary: "I learned very quickly that BGP isn't just a routing protocol. It is a financial instrument. Here is how we used Local Pref to slash bandwidth costs."
---

> "I learned very quickly that BGP isn't just a routing protocol. It is a financial instrument."

At **Net4** and **Spectranet**, our biggest OpEx was the monthly bandwidth bill.

# The Scenario: Premium vs. Budget

We were Multi-Homed:

* **Provider A (Premium)**: Low latency, Expensive.
* **Provider B (Budget)**: Higher latency, Cheap/Flat Rate.

**The Problem:** BGP looks for shortest path, not cheapest. We were burning money delivering 4K cat videos over our Premium Tier-1 link.

---

# The Fix: Engineering Traffic Flow

We utilized two key BGP attributes: **Local Preference** (Outbound) and **AS Path Prepending** (Inbound).

### 1. Outbound: Local_Pref

We identified **High-Bandwidth Prefixes** (Netflix, Google). We tagged them to prefer the Cheap Link.

```cisco
! Cisco IOS Syntax
route-map PREFER_CHEAP_LINK permit 10
 match ip address prefix-list BULK_TRAFFIC_CDNS
 set local-preference 200
!
router bgp 65000
 neighbor 1.1.1.1 route-map PREFER_CHEAP_LINK in
```

### 2. Inbound: AS Path Prepending

We needed the internet to reply via the Cheap Link.
We artificially inflated the AS Path on the Premium advertisement by **prepending** our AS number multiple times.

* **Result**: The world saw the Premium path as "Longer" (Worse) and chose the Budget path.

# The Result

* **Cost**: Offloaded 70% of bulk traffic to the cheap link.
* **Performance**: The Premium link remained uncongested for critical VoIP/SSH traffic.

### Key Takeaway

**Routing isn't just about connectivity; it's about economics.**

Good engineering isn't always the "fastest path." It's the most efficient one. If you aren't looking at BGP tables with a dollar sign in mind, you're just connecting wires.
