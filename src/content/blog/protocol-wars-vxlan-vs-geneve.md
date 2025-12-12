---
title: "Protocol Wars: Why NSX-T uses Geneve instead of VXLAN"
date: 2021-03-18
description: "When we upgraded from NSX-V to T, the packet headers changed. Why did VMware ditch the industry-standard VXLAN for Geneve? The answer lies in the limitations of a fixed-size header."
draft: false
tags: ["nsx-t", "geneve", "vxlan", "protocols", "networking", "ntt-data"]
---

> "One change confused every engineer I spoke to: 'Why did VMware ditch the industry standard VXLAN? Why are we using this thing called Geneve?'"

It was March 2021. We were knee-deep in migrating clients from **NSX-V** (vSphere only) to **NSX-T** (Multi-Cloud).

It wasn't just a rebrand. It was a technical necessity.

---

# The Limitation: VXLAN's Fixed Header

**VXLAN (RFC 7348)** was revolutionary. It gave us a 24-bit **VNI (Virtual Network Identifier)**, allowing for 16 million segments.

But it had a flaw: The header was **fixed**.

**VXLAN Header Structure:**

* **Flags**: Mostly unused.
* **VNI (24 bits)**: The ID.
* **Reserved**: Wasted space.

If you wanted to insert metadata—like "This packet came from container X"—there was nowhere to put it. You were stuck.

# The Geneve Advantage: TLV

**Geneve (RFC 8926)** solved this with **TLV (Type-Length-Value)** options.

It has a **Variable Length Options** field. It allows the control plane to insert arbitrary data into the packet header without breaking hardware parsers.

# The Impact

Why does this matter? **Context.**

In NSX-T, when a packet leaves a **Kubernetes Pod**, we can stuff the **Pod Name** and **Security Tags** *inside the packet header*.

When that packet hits the firewall, we aren't just looking at Source IP (which changes every time a Pod restarts). We are looking at the **identity** embedded in the packet.

### Key Takeaway

**Protocols evolve because requirements evolve.**

VXLAN was built for Virtual Machines. Geneve was built for the API-driven, ephemeral world of Containers. Don't get married to a packet header; get married to the problem it solves.
