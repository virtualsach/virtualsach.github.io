---
title: "Connecting 5M+ Users: Seamless IPv6 Migration for Finance"
date: 2015-11-15
description: "Enabled 5M+ mobile users to access a major banking app via IPv6 without touching the legacy IPv4 backend, utilizing A10 Thunder ADCs and SLB-PT."
summary: "Seamless IPv6 migration for a financial giant using NAT64/DNS64 and Application Layer Gateways."
role: "Network Strategy Lead"
tags: ["ipv6", "routing", "finance", "migration", "architecture", "python", "banking", "case-study"]
---

> "The client had strict regulatory mandates to support IPv6, but their backend was stuck in the past. 'Just enable Dual Stack' was impossible."

# Executive Summary

In 2015, the mobile internet landscape in India shifted with the launch of **Reliance Jio**, an IPv6-only network.

A major **Financial Services Client** faced a crisis: their banking app was invisible to millions of new users. I architected a transparent translation layer using **A10 Thunder ADCs**, bridging the gap between the mobile web and the legacy backend.

# The Challenge

The stakes were high. This was a live banking transaction system.

* **Legacy Debt:** The backend (middleware, Oracle DBs, Mainframes) was hardcoded for **IPv4**.
* **Zero Downtime:** We could not afford maintenance windows for experimental routing changes.
* **Embedded IPs:** Protocols like **FTP** and **SIP** embedded IP addresses inside the data payload, which simple **NAT** breaks.

---

# The Solution

We implemented a **NAT64/DNS64** architecture. The core innovation was leveraging **SLB-PT** (Server Load Balancing - Protocol Translation).

## Tech Stack

* **ADC/Load Balancer:** **A10 Networks Thunder Series** (Hardware Appliances)
* **Legacy LB:** **Cisco ACE** (Target for migration)
* **Protocols:** **IPv6**, **BGP**, **SLB-PT**
* **Automation:** **Python** scripts for config validation

## Technical Deep Dive

The translation was transparent to both sides.

1. **Mobile Client (IPv6)** does a DNS lookup.
2. **DNS64 Server** synthesizes an **AAAA record** (IPv6) that points to the A10 VIP.
3. **A10 ADC** terminates the connection and translates the source IP to its own **IPv4 SNAT** address.
4. **Server (IPv4)** sees a request from the A10 and responds normally.

**The "Secret Sauce": Application Layer Gateways (ALGs)**
Standard NAT breaks when IPs are in the payload. We enabled **ALGs** on the A10s to inspect and rewrite:

* **FTP:** Rewriting the `PORT` command.
* **SIP:** Rewriting the **SDP headers** for VoIP calls.

### Architecture Flow

```mermaid
graph LR
    Client[Mobile User (IPv6)] -- "Src: 2001:db8::1 <br> Dst: 64:ff9b::vip" --> A10[A10 Thunder ADC]
    
    subgraph "Translation Boundary"
    A10 -- "NAT64 Translation <br> ALG Rewrites" --> A10Engine
    end
    
    A10Engine -- "Src: 10.10.1.5 (SNAT) <br> Dst: 192.168.1.10" --> Server[Legacy Backend (IPv4)]
    
    Server -- Response --> A10Engine
    A10Engine -- "Src: 64:ff9b::vip <br> Dst: 2001:db8::1" --> Client
```

# The Outcome

* **Continuity:** Seamless access for **5 Million+ mobile users**.
* **Performance:** Reduced backend server CPU load by **30%** by offloading SSL termination.
* **Compliance:** Met **RBI (Reserve Bank of India)** mandates for IPv6 adoption 6 months ahead of schedule.
