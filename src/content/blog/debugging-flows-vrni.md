---
title: "Seeing the Invisible: Debugging Flows with vRealize Network Insight (vRNI)"
date: 2020-11-05
description: "The Firewall logs said Green. The Application team said Red. vRNI showed us the truth: A micro-burst buffer overflow on a physical switch that was invisible to everyone else."
draft: false
tags: ["vrni", "troubleshooting", "networking", "overlay", "underlay", "ntt-data"]
---

> "The App is timing out connecting to the Database! It's the Firewall! It's always the Firewall!"

It was November 2020. The Application Team was furious.

I checked the **NSX Distributed Firewall logs**. `Action: ALLOW`.
Everything looked Green. But the packets were dying.

---

# The Investigation: vRNI

We fired up **vRealize Network Insight (vRNI)**. Unlike standard monitoring tools that just check "Is it up?", vRNI maps the specific path of a specific flow.

I entered a natural language query:
`Analyze flow from VM 'Web-01' to VM 'DB-01'`

# The Visualization

The screen lit up with a topology map that spanned the Virtual and Physical worlds.

1. **Virtual**: vNIC -> Logical Switch -> Edge Node.
2. **Physical**: Host NIC -> Leaf Switch -> Spine -> Destination.

Right there, on the **Physical Leaf Switch (Port 1/48)**, there was a red dot:
**"Packet Drops: Buffer Overflow"**

# The Discovery: Micro-bursts

It wasn't a constant error. It was a **Micro-burst**.

Every hour at xx:00, a scheduled backup job kicked off. For **200 milliseconds**, traffic spiked and filled the switch ASIC buffer.

Standard **SNMP polling** (running every 5 minutes) completely missed it. But vRNI caught it.

### Key Takeaway

**The Overlay is only as robust as the Underlay.**

You can have the most advanced Software-Defined Network in the world, but if a physical cable is bad or a buffer is full, your packets are still dead.
