---
title: "Protocol Wars: Why NSX-T uses Geneve instead of VXLAN"
date: 2021-03-18
description: "When we upgraded from NSX-V to T, the packet headers changed. Why did VMware ditch the industry-standard VXLAN for Geneve? The answer lies in the limitations of a fixed-size header."
draft: false
tags: ["nsx-t", "geneve", "vxlan", "protocols", "networking", "ntt-data"]
---

It was March 2021. We were knee-deep in migrating clients from NSX-V (vSphere only) to NSX-T (Multi-Cloud).

One change confused every engineer I spoke to: *"Why did VMware ditch the industry standard VXLAN? Why are we using this thing called Geneve?"*

It wasn't just a rebrand. It was a technical necessity.

## The Limitation: VXLAN's Fixed Header

VXLAN (RFC 7348) was revolutionary. It gave us a 24-bit **VNI (Virtual Network Identifier)**, allowing for 16 million segments. But it had a flaw: The header was **fixed**.

**VXLAN Header Structure:**

* **Flags (8 bits)**: Mostly unused.
* **Reserved (24 bits)**: Wasted space.
* **VNI (24 bits)**: The ID.
* **Reserved (8 bits)**: More wasted space.

That's it. If you wanted to insert metadata—like "This packet came from container X" or "This packet matches Security Group Y"—there was nowhere to put it. You were stuck.

## The Geneve Advantage: TLV

Geneve (Generic Network Virtualization Encapsulation - RFC 8926) solved this with **TLV (Type-Length-Value)** options.

It has a **Variable Length Options** field. It allows the control plane to insert arbitrary data into the packet header without breaking the hardware parsers.

**Geneve Header Structure:**

* **VNI (24 bits)**: Same as VXLAN.
* **Ver/Opt Len**: Tells the hardware how long the header is.
* **Variable Length Options**: The magic sauce.

## The Impact

Why does this matter? **Context.**

In NSX-T, when a packet leaves a Kubernetes Pod, we can stuff the **Pod Name**, **Namespace**, and **Security Tags** *inside the packet header*.

When that packet hits the firewall, we aren't just looking at Source IP (which changes every time a Pod restarts). We are looking at the *identity* embedded in the packet.

## The Lesson

**Protocols evolve because requirements evolve.**

VXLAN was built for Virtual Machines (static IPs, long life). Geneve was built for the API-driven, ephemeral world of Containers and Cloud. Don't get married to a packet header; get married to the problem it solves.
