---
title: "Resilient Enterprise WAN: Multi-Homed BGP Architecture"
date: 2011-08-22
description: "Architected a failover solution for premium enterprise customers using Multi-Homed BGP on Cisco ASR routers, seamlessly switching between Fiber and WiMAX."
summary: "Automated BGP Failover between Fiber and RF links using Route Maps."
tags: ["bgp", "cisco", "wan", "routing", "resilience", "case-study"]
---

# The Challenge

In the dusty streets of India, physical fiber cuts were a daily reality.
For our premium Enterprise customers (Banks, Call Centers), a fiber cut meant a complete outage. They demanded **99.9% uptime**, but relying on a single physical path was a single point of failure.

**The Barrier:**

* **Unstable Last Mile:** Road construction constantly severed underground cables.
* **Manual Failover:** Switching to a backup link required manual intervention, taking 30-60 minutes.

# The Solution

I architected a **Multi-Homed BGP** solution. We delivered two physical links to the customer premises:

1. **Primary:** Optical Fiber (High Bandwidth, Low Latency).
2. **Backup:** RF/WiMAX Wireless Link (Lower Bandwidth, Independent Path).

**The Tech Stack:**

* **Router:** Cisco ASR 1000 Series (Edge)
* **Protocol:** eBGP (External BGP)
* **Mechanism:** BGP Attributes (Local Preference, MED, AS-Path Prepending)

# Route Manipulation Strategy

The magic wasn't in the hardware; it was in the **BGP Route Maps**. We didn't just want "active-standby"; we wanted intelligent traffic steering.

**Outbound Traffic (Local Preference):**
We configured `Local Preference` to tell the customer's router: *"Always prefer the Fiber link (LocalPref 200) over the WiMAX link (LocalPref 100) for sending data out."*

**Inbound Traffic (AS-Path Prepending):**
To control return traffic from the internet, we used `AS-Path Prepending`. We artificially "poisoned" the WiMAX path by adding our AS Number three times.

* **Path via Fiber:** `AS12345` (Short path, preferred by the world).
* **Path via WiMAX:** `AS12345 AS12345 AS12345` (Long path, avoided unless Fiber is down).

```mermaid
graph TD
    Internet((Internet))
    
    subgraph "ISP Core"
    PE1[Provider Edge 1 (Fiber)]
    PE2[Provider Edge 2 (WiMAX)]
    end
    
    subgraph "Customer Edge"
    CE[Cisco Router]
    end
    
    Internet --> PE1
    Internet --> PE2
    
    PE1 --"Primary (LocalPref 200)"--> CE
    PE2 --"Backup (LocalPref 100 + Prepend)"--> CE
    
    style PE1 stroke:#0f0,stroke-width:2px
    style PE2 stroke:#f00,stroke-width:2px,stroke-dasharray: 5 5
```

# Business Impact

* **Reliability:** Achieved **99.9% uptime** for critical accounts. Fiber cuts became "non-events" as BGP failed over automatically in seconds.
* **Efficiency:** Eliminated the need for 24/7 manual monitoring for link flapping.
* **Trust:** This architecture became the standard "Gold Tier" offering for the ISP, commanding a 40% price premium.
