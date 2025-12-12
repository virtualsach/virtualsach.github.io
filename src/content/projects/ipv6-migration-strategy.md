---
title: "Future-Proofing Finance: IPv6 Migration & ADC Strategy"
date: 2015-11-15
description: "Enabled 5M+ mobile users to access a major banking app via IPv6 without touching the legacy IPv4 backend, utilizing A10 Thunder ADCs and SLB-PT."
summary: "Seamless IPv6 migration for a financial giant using NAT64/DNS64 and Application Layer Gateways."
tags: ["ipv6", "a10-networks", "nat64", "slb-pt", "python", "banking", "case-study"]
---

# Executive Summary

In 2015, the mobile internet landscape in India shifted Seismicly with the launch of Reliance Jio, an IPv6-only network. **A major Financial Services Client** faced a crisis: their banking app was invisible to millions of new users. I architected a transparent translation layer using **A10 Thunder ADCs**, bridging the gap between the modern IPv6 mobile web and the legacy IPv4 backend without requiring a single line of code change on the application servers.

# The Challenge

The stakes were high. The client had strict regulatory mandates to support IPv6, but their infrastructure was stuck in the past.

* **Legacy Debt:** The backend (middleware, Oracle DBs, Mainframes) was hardcoded for IPv4. "Just enable Dual Stack" was impossible without a commercially unviable rewrite.
* **Zero Downtime:** This was a live banking transaction system. We could not afford maintenance windows for experimental routing changes.
* **Embedded IPs:** Some protocols (like FTP and SIP used for customer support) embedded IP addresses inside the data payload, which simple Network Address Translation (NAT) breaks.

# Tech Stack & Architecture

* **ADC/Load Balancer:** A10 Networks Thunder Series (Hardware Appliances).
* **Legacy LB:** Cisco ACE (Target for migration).
* **Protocols:** IPv6, BGP, **SLB-PT** (Server Load Balancing - Protocol Translation).
* **Automation:** Python scripts for config validation and pre-migration checks.

# The Solution (Deep Dive)

We implemented a **NAT64/DNS64** architecture. The core innovation was leveraging **SLB-PT (Server Load Balancing - Protocol Translation)** on the A10s, which is distinct from standard Carrier Grade NAT (CGNAT).

## Architecture Flow

The translation was transparent to both sides.

1. **Mobile Client (IPv6)** does a DNS lookup.
2. **DNS64 Server** synthesizes an AAAA record (IPv6) that points to the A10 VIP.
3. **Client** sends a packet to the **IPv6 VIP**.
4. **A10 ADC** terminates the connection. It matches the VIP to an **IPv4 Server Pool**.
5. **A10 ADC** translates the source IP to its own **IPv4 SNAT** address and forwards the packet.
6. **Server (IPv4)** sees a request from the A10 (IPv4) and responds normally.

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

## The "Secret Sauce": Application Layer Gateways (ALGs)

Standard NAT breaks protocols that send IP information in the payload (not just headers). We enabled **ALGs** on the A10s to inspect the packet payload and rewrite IPs inside the data stream for:

* **FTP:** Rewriting the `PORT` command.
* **SIP:** Rewriting the SDP headers for VoIP calls.

# The Outcome

* **Continuity:** Seamless access for **5 Million+ mobile users**. The app just "worked" on IPv6 networks.
* **Performance:** By offloading SSL termination to the dedicated hardware of the A10s, we reduced the backend server CPU load by **30%**, deferring a costly hardware refresh.
* **Compliance:** The bank met RBI (Reserve Bank of India) compliance mandates for IPv6 adoption 6 months ahead of the deadline.
