---
title: "Bridging Physical & Virtual: The Arista HW-VTEP Integration"
date: 2018-03-12
description: "Connecting bare-metal Oracle RAC servers to a VMware NSX overlay required bridging two worlds. Here is how I used Arista HW-VTEP and OVSDB to make it happen."
draft: false
tags: ["nsx", "arista", "vxlan", "hw-vtep", "ibm", "sdn"]
---

It was March 2018. I was consulting for IBM, designing a massive Software-Defined Data Center (SDDC) for a financial client. We had built a beautiful, fully virtualized NSX environment using Overlay networking (VXLAN).

But then came the requirement: *"We need our bare-metal Oracle RAC servers to be on the same Layer 2 segment as the App VMs."*

The Overlay world met the Physical world. And they didn't speak the same language.

## The Solution: Hardware VTEP (HW-VTEP)

We decided to use Arista switches as a **Hardware VTEP (VXLAN Tunnel Endpoint)**. Essentially, the switch acts as a gateway that encapsulates frames from the physical server into VXLAN packets and shoots them into the NSX overlay.

## The Protocol: OVSDB

The magic glue here isn't BGP (yet); it's **OVSDB (Open vSwitch Database Protocol)**.

NSX Manager (the Controller) needs to tell the Arista switch (the VTEP):

1. "Here is the MAC address table of the VMs."
2. "Here is the VNI you need to use."

We configured the Arista switch to register with the NSX controllers using a certificate-based handshake. Once peered, the Arista switch appeared in the NSX GUI as a "Hardware Gateway."

## The Debug: MTU and VNI Mismatches

This integration was bleeding edge at the time, and we hit two major walls:

1. **VNI Mismatch**: We accidentally mapped logical switch VNI `5001` to VLAN `100` on one port, and `5002` on another. Silent packet blackholing ensued.
2. **MTU Fragmentation**: The breakdown of the *Don't Fragment* bit. The physical packets were 1500 bytes. Adding the VXLAN header (50 bytes) pushed them to 1550 bytes. The WAN link between data centers was only 1500 MTU. We had to enable Jumbo Frames end-to-end to fix the fragmentation drops.

## The Code: Arista VXLAN Configuration

The Arista CLI is beautiful, but configuring VXLAN manually (before OVSDB took over) helped us understand the plumbing. Here is exactly how we mapped the VNI to the VLAN.

```bash
interface Vxlan1
   vxlan source-interface Loopback1
   vxlan udp-port 4789
   vxlan vlan 100 vni 5001
   vxlan vlan 200 vni 5002
   vxlan flood vtep 192.168.10.10 192.168.10.11
```

*(In production, OVSDB pushes these mappings dynamically, but verifying them via `show interfaces vxlan1` was our daily troubleshooting ritual.)*

## The Outcome

Once stabilized, it worked like magic. An Oracle RAC node on a physical Arista port could verify multicast heartbeats with a VM on an ESXi host three racks away, thinking they were on the same switch.

We had successfully bridged the physical and virtual worlds, removing the need to hair-pin traffic through a software Edge Gateway, significantly boosting performance.
