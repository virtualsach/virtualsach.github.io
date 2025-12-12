---
title: "IPv4 Exhaustion is Real: My Strategy for IPv6 Dual Stacking"
date: 2013-08-14T09:00:00+05:30
draft: false
tags: ["Networking", "IPv6", "Infrastructure", "ISP", "Case Study"]
summary: "We ran out of allocatable IPv4 blocks. This wasn't a theoretical exercise; it was an operational crisis. Here is the deep dive into how we architected the transition to IPv6."
---

> "We ran out of allocatable IPv4 blocks. This wasn't a theoretical exercise; it was an operational crisis. The only way forward was IPv6."

We’ve been hearing about "IPv4 exhaustion" for decades. But at **Net4**, it finally happened. We hit the wall.

# Phase 1: The Upstream Handshake (BGP)

The first step was establishing **IPv6 BGP peering**.
The scale shifts immediately:

* IPv4: Advertising `/24`s.
* IPv6: Advertising `/32`s/`/48`s.

Use rigorous **Prefix Lists** and **AS-PATH filtering**. You do not want to accidentally become a transit AS for global IPv6 traffic.

---

# Phase 2: The Security Paradigm Shift

**IPv6 kills NAT.**
In IPv4, we lazily treated NAT as security. In IPv6, every device has a Global Unicast Address (GUA).

We rigorously audited our edge security:

1. **Stateless ACLs**: Dropped all incoming new sessions (mimicking stateful walls).
2. **ICMPv6**: You cannot block it entirely (it breaks Neighbor Discovery). You must fine-tune filters.

# Phase 3: The Dual Stack Architecture

We chose a **Dual Stack** architecture.

* **DNS**: Updated to return both **A** (IPv4) and **AAAA** (IPv6) records.
* **Throughput**: IPv6 throughput was marginally better because it eliminated NAT CPU overhead.

### Key Takeaway

**Don't fear the hex code.**

IPv4 (4.3 billion addresses) is mathematically insufficient. The exhaustion is real. The only way out is through the hex.
