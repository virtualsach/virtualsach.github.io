---
title: "Stretching VLANs Across the World: An L2VPN War Story"
date: 2018-05-10
description: "Physics dictates latency, but L2VPN dictates topology. How we moved a hardcoded legacy app from Mumbai to London without checking the IP, using NSX L2VPN and the 'Sink Port' hack."
draft: false
tags: ["nsx", "l2vpn", "migration", "softlayer", "ibm", "networking"]
---

> "One application refused to die. A hardcoded monstrosity interacting with AS/400 mainframes. It needed to move 4,000 miles, but it needed to believe it hadn't moved an inch."

We were moving a workload from **Mumbai** to **London**.
Re-IPing was impossible.

# The Solution: NSX L2VPN

We deployed an **L2VPN tunnel** over the public internet.
Ethernet frames entering in Mumbai were spit out in London, on the same broadcast domain.

---

# The Technical Detail: Sink Ports

The tricky part was bridging the physical network to the virtual tunnel. We used a **Sink Port**.

A "Sink Port" is a hack where you assign an interface to the L2VPN service but give it a dummy IP.

```text
Interface: vNIC 2 (Trunk)
Subnet: 169.254.1.1/30 (Dummy)
L2VPN Config: VLAN 100 -> Tunnel 5001
```

# The MTU Fight

The internet MTU is 1500. L2VPN adds overhead.
We faced massive fragmentation. The app hung on data transfer.

**The Fix**: Enabled **MSS Clamping** on the Edge Gateway, forcing the TCP session to negotatiate a lower Segment Size (1350 bytes).

### Key Takeaway

**Topology is just a state of mind.**

We moved the VM. Ping time went from `<1ms` to `140ms` (Physics). But the application **worked**.
