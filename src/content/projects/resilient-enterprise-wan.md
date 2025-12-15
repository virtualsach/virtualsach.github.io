---
title: "99.9% Uptime: Automated BGP Failover for Enterprise WAN"
date: 2011-08-22
description: "Architected a 99.9% uptime failover solution for premium enterprise customers using Multi-Homed BGP, automated via Route Maps and BFD."
summary: "Automated BGP Failover between Fiber and RF/WiMAX using Route Maps and BFD."
role: "Senior Network Engineer"
tags: ["bgp", "wan", "routing", "resilience", "enterprise", "high-availability", "case-study"]
---

> "For premium Enterprise customers, a single backhoe digging up a road meant a complete business outage. The 'Last Mile' was the weakest link."

# Executive Summary

In 2011, reliable physical infrastructure in India was rare.

I architected a **Multi-Homed BGP** solution that combined the speed of **Optical Fiber** with the independence of **RF/WiMAX**. This delivered **99.9% uptime** by automating failover at the routing protocol level.

# The Challenge

Physical reliability was low. Fiber cuts were a "when," not an "if."

* **Single Point of Failure:** Most customers relied on a single fiber drop.
* **Manual Failover:** Backup links often required 30+ minutes of manual cable swapping.
* **Latency Sensitivity:** **VoIP** traffic required sub-second failover, not the 3-minute BGP convergence default.

---

# The Solution

We implemented an **Active/Standby** BGP design with attributes tuned for specific traffic paths.

## Tech Stack

* **Edge Router:** **Cisco ASR 1000 Series**
* **Protocols:** **eBGP**, **OSPF**, **BFD** (Bidirectional Forwarding Detection)
* **Transport:** **Metro Ethernet** (Primary) + **WiMAX/RF** (Backup)

## Technical Deep Dive

### 1. Traffic Steering Strategy

* **Outbound:** Used **Local Preference** to force traffic to Fiber (Pref 200) over WiMAX (Pref 100).
* **Inbound:** Used **AS Path Prepending** to make the WiMAX path look "longer" to the global internet.

### 2. Sub-Second Failover (BFD)

Standard BGP takes up to 3 minutes to realize a neighbor is dead. That drops calls.

We implemented **BFD**, a lightweight "heartbeat" protocol that checks connectivity every **50ms**.

* **Detection Time:** 50ms x 3 = **150ms**.
* **Result:** The moment fiber is cut, traffic swings to WiMAX without dropping active calls.

### Configuration Snippet

This Route Map enforces the policy on the Provider Edge (PE) router:

```cisco
! Define the Policy for Primary Link (Fiber)
route-map RM_CUST_PRIMARY permit 10
 set local-preference 200
!
! Define the Policy for Backup Link (WiMAX)
route-map RM_CUST_BACKUP permit 10
 set local-preference 100
 set as-path prepend 12345 12345 12345
!
! Apply to BGP Neighbors with BFD
router bgp 12345
 neighbor 10.1.1.2 remote-as 65000
 neighbor 10.1.1.2 route-map RM_CUST_PRIMARY in
 neighbor 10.1.1.2 fall-over bfd
 !
 neighbor 10.2.2.2 remote-as 65000
 neighbor 10.2.2.2 route-map RM_CUST_BACKUP in
 neighbor 10.2.2.2 fall-over bfd
```

# The Outcome

* **Reliability:** Achieved **Zero Downtime** during 3 major fiber cuts in 2010.
* **Efficiency:** Saved bandwidth costs by using the expensive RF spectrum only when necessary.
* **Revenue:** This "Gold Tier" SLA product commanded a **40% premium**.
