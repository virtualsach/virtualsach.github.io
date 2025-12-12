---
title: "Seeing the Invisible: Debugging Flows with vRealize Network Insight (vRNI)"
date: 2020-11-05
description: "The Firewall logs said Green. The Application team said Red. vRNI showed us the truth: A micro-burst buffer overflow on a physical switch that was invisible to everyone else."
draft: false
tags: ["vrni", "troubleshooting", "networking", "overlay", "underlay", "ntt-data"]
---

It was November 2020. The Application Team was furious.
*"The App is timing out connecting to the Database! It's the Firewall! It's always the Firewall!"*

I checked the NSX Distributed Firewall logs. `Action: ALLOW`.
I checked the Edge Gateway logs. `Action: ALLOW`.

Everything looked Green. But the packets were dying.

## The Investigation: vRNI

We fired up **vRealize Network Insight (vRNI)**. Unlike standard monitoring tools that just check "Is it up?", vRNI maps the specific path of a specific flow across the entire fabric.

I entered a natural language query in the search bar:
`Analyze flow from VM 'Web-01' to VM 'DB-01'`

## The Visualization: Flow Analysis

The screen lit up with a topology map that spanned the Virtual and Physical worlds.

1. **Virtual**: vNIC -> Logical Switch -> Edge Node.
2. **Physical**: Host NIC -> Top-of-Rack Switch (Leaf) -> Spine -> Leaf -> Destination Host.

It drew a line tracing the packet's journey. And right there, on the **Physical Leaf Switch (Port 1/48)**, there was a red dot.

**"Packet Drops: Buffer Overflow"**

## The Discovery: Micro-bursts

It wasn't a constant error. It was a **Micro-burst**.
Every hour at exactly xx:00, a scheduled backup job kicked off on a neighboring server sharing the same physical uplink. For 200 milliseconds, traffic spiked, filled the switch ASIC buffer, and tailored dropped our Database packets.

Standard SNMP polling (which runs every 5 minutes) completely missed it. But vRNI, listening to granular telemetry, caught it.

## The Fix

We adjusted the **Quality of Service (QoS)** queue buffers on the physical switch to give the Database traffic priority over the Backup traffic. The timeouts vanished instantly.

## The Lesson

**The Overlay is only as robust as the Underlay.**
You can have the most advanced Software-Defined Network in the world, but if a physical cable is bad or a buffer is full, your packets are still dead. You need visibility into both layers to see the whole picture.
