---
title: "Bridging Physical & Virtual: The Arista HW-VTEP Integration"
date: 2018-03-12
description: "Connecting bare-metal Oracle RAC servers to a VMware NSX overlay required bridging two worlds. Here is how I used Arista HW-VTEP and OVSDB to make it happen."
draft: false
tags: ["nsx", "arista", "vxlan", "hw-vtep", "ibm", "sdn"]
---

> "The Overlay world met the Physical world. And they didn't speak the same language."

It was March 2018. The requirement: *"We need our bare-metal Oracle RAC servers to be on the same Layer 2 segment as the App VMs."*

# The Solution: Hardware VTEP

We used **Arista switches** as a **Hardware VTEP (VXLAN Tunnel Endpoint)**.
The switch acts as a gateway, encapsulating physical frames into VXLAN packets.

## The Protocol: OVSDB

The magic glue is **OVSDB** (Open vSwitch Database Protocol).
NSX Manager tells the Arista switch:

1. "Here is the MAC table of the VMs."
2. "Here is the VNI you need to use."

---

# The Debug: Mismatches

We hit two walls:

1. **VNI Mismatch**: Mapped VNI `5001` to VLAN `100` on one port, `5002` on another. Silent blackholing.
2. **MTU**: Physical packets (1500) + VXLAN Header (50) = 1550 bytes. We had to enable **Jumbo Frames** end-to-end.

## The Code: Arista VXLAN Config

```bash
interface Vxlan1
   vxlan source-interface Loopback1
   vxlan udp-port 4789
   vxlan vlan 100 vni 5001
   vxlan flood vtep 192.168.10.10 192.168.10.11
```

*(Note: OVSDB usually pushes this, but we verified it via CLI).*

### Key Takeaway

**Bridge the gap without hair-pinning.**

We bridged physical and virtual worlds without hair-pinning traffic through a software gateway, significantly boosting performance for Oracle.
