---
title: "Resilient Enterprise WAN: Multi-Homed BGP Architecture"
date: 2011-08-22
description: "Architected a 99.9% uptime failover solution for premium enterprise customers using Multi-Homed BGP, automated via Route Maps and BFD."
summary: "Automated BGP Failover between Fiber and RF/WiMAX using Route Maps and BFD."
tags: ["bgp", "cisco", "wan", "routing", "bfd", "high-availability", "case-study"]
---

# Executive Summary

In the chaotic physical infrastructure of 2011 India, **The "Last Mile" was the weakest link**. For premium Enterprise customers (Banks, Call Centers), a single backhoe digging up a road meant a complete business outage. I architected a **Multi-Homed BGP** solution that combined the speed of Optical Fiber with the independence of RF/WiMAX, delivering **99.9% uptime** by automating failover at the routing protocol level.

# The Challenge

Physical reliability was low. Road widening projects and erratic construction meant fiber cuts were a "when," not an "if."

* **The Single Point of Failure:** Most customers had a single fiber drop. When it broke, they were offline for 4-8 hours.
* **The Manual Failover:** Backup links (if they existed) often required manual cable swaps or router config changes, leading to 30+ minutes of downtime.
* **Latency Sensitivity:** Voice (VoIP) traffic required sub-second failover, not the default 3-minute BGP convergence time.

# Tech Stack & Architecture

* **Edge Router:** Cisco ASR 1000 Series (Aggregating 100+ Customers).
* **CPE:** Cisco 2900 Series (Customer Premises).
* **Protocols:** eBGP, OSPF, **BFD (Bidirectional Forwarding Detection)**.
* **Transport:**
  * **Primary:** Metro Ethernet (Fiber).
  * **Backup:** WiMAX / RF Link (Wireless).

# The Solution (Deep Dive)

We implemented an **Active/Standby** BGP design with attributes tuned for specific traffic paths.

## 1. Traffic Steering Strategy

* **Outbound (customer -> Internet):** We used `Local Preference`.
  * Fiber path tagged with `LocalPref 200`.
  * WiMAX path tagged with `LocalPref 100`.
  * *Result:* Router always chooses Fiber if available.
* **Inbound (Internet -> Customer):** We used `AS Path Prepending`.
  * We artificially lengthened the AS Path on the WiMAX link so the global internet would view it as a "worse" path.

## 2. Sub-Second Failover (BFD)

Standard BGP takes up to 3 minutes ("Hold Time") to realize a neighbor is dead. That drops calls.
We implemented **BFD**, a lightweight "heartbeat" protocol that checks connectivity every 50ms.

* **Detection Time:** 50ms x 3 = 150ms.
* *Result:* The moment fiber is cut, BGP tears down the session instantly, and traffic swings to WiMAX without dropping active VoIP calls.

## Configuration Snippet: The Route Map

This is the exact logic used to enforce the policy on the Provider Edge (PE) router:

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
! Apply to BGP Neighbors
router bgp 12345
 neighbor 10.1.1.2 remote-as 65000
 neighbor 10.1.1.2 description CUST_FIBER
 neighbor 10.1.1.2 route-map RM_CUST_PRIMARY in
 neighbor 10.1.1.2 fall-over bfd
 !
 neighbor 10.2.2.2 remote-as 65000
 neighbor 10.2.2.2 description CUST_WIMAX
 neighbor 10.2.2.2 route-map RM_CUST_BACKUP in
 neighbor 10.2.2.2 fall-over bfd
```

# The Outcome

* **Reliability:** Achieved **Zero Downtime** during 3 major fiber cuts in 2010. The failover was so fast that users didn't notice.
* **Efficiency:** We saved money by using the expensive RF spectrum only when necessary.
* **Revenue:** This "Gold Tier" SLA product commanded a **40% premium** over standard connections.
