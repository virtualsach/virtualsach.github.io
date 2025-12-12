---
title: "Stretching VLANs Across the World: An L2VPN War Story"
date: 2018-05-10
description: "Physics dictates latency, but L2VPN dictates topology. How we moved a hardcoded legacy app from Mumbai to London without checking the IP, using NSX L2VPN and the 'Sink Port' hack."
draft: false
tags: ["nsx", "l2vpn", "migration", "softlayer", "ibm", "networking"]
---

It was May 2018. We were moving a client's workload from a legacy data center in Mumbai to the IBM Cloud in London.

One application refused to die. It was a hardcoded monstrosity interacting with AS/400 mainframes. Re-IPing it was impossible. It needed to move 4,000 miles, but it needed to believe it hadn't moved an inch.

## The Solution: NSX L2VPN

We deployed a Standalone NSX Edge (acting as the Client) in Mumbai and peered it with the NSX Edge (Server) in London. We built an **L2VPN tunnel** over the public internet.

This wasn't just a VPN; it was a wormhole. Ethernet frames entering the interface in Mumbai were encapsulated and spit out in London, on the same broadcast domain.

## The Technical Detail: Sink Ports

The tricky part was bridging the physical network to the virtual tunnel.
We used a **Sink Port**.

A "Sink Port" is a hack where you assign an interface (Internal) to the L2VPN service but give it a dummy IP. The Edge then "sinks" (bridges) all traffic from the specified VLAN into the tunnel, regardless of IP.

```text
Interface: vNIC 2 (Trunk)
Subnet: 169.254.1.1/30 (Dummy)
L2VPN Configuration:
  - VLAN ID: 100
  - Tunnel ID: 5001
```

Traffic hitting VLAN 100 on vNIC 2 didn't route; it just fell into Tunnel 5001 and popped out in London.

## The MTU Fight

The internet is hostile. The standard MTU is 1500. VXLAN/L2VPN adds overhead.
We faced massive fragmentation. The app would connect, handshake (small packets), and then hang on data transfer (large packets).

We had to enable **MSS Clamping** on the Edge Gateway, forcing the TCP session to negotiate a lower Maximum Segment Size (1350 bytes) to fit inside the tunnel without fragmentation.

## The Result

We moved the VM. The ping time went from `<1ms` to `140ms` (Physics is non-negotiable). But the application **worked**. The Gateway IP was still in Mumbai, but the VM was in London.

Topology is just a state of mind.
