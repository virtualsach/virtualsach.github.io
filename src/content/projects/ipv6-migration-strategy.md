---
title: "Future-Proofing Finance: IPv6 Migration & ADC Strategy"
date: 2015-11-15
description: "Enabled millions of mobile users to access a major banking app via IPv6 without re-architecting the legacy backend, using NAT64/DNS64 on A10 ADCs."
summary: "Bridging the IPv6 gap for a major financial institution using SLB-PT."
tags: ["ipv6", "a10-networks", "nat64", "load-balancing", "banking", "case-study"]
---

# The Challenge

A major **Financial Services Client** was facing a critical accessibility issue. Mobile carriers (like Reliance Jio) were shifting to IPv6-only networks. The client's mobile banking application needed to be reachable via IPv6 to support these users.

**The Barrier:**

* **Legacy Backend:** The entire backend infrastructure (middleware, databases, mainframes) was hardcoded for IPv4.
* **Cost:** Re-architecting the backend for dual-stack support was estimated to take 2 years and cost millions.
* **Deadline:** The business needed a solution in 3 months.

# The Solution

I designed a **NAT64/DNS64 Translation Layer** using **A10 Thunder ADCs**.
Instead of changing the backend, we changed the "Front Door."

**The Tech Stack:**

* **ADC:** A10 Networks Thunder Series
* **Legacy LB:** Cisco ACE (Migrated away from)
* **Routing:** IPv6 BGP Peering
* **Mechanism:** SLB-PT (Server Load Balancing - Protocol Translation)

**Key Innovation: SLB-PT**
We utilized the hardware acceleration of the A10s to perform massive scale Network Address Translation (NAT) and Protocol Translation (PT) in real-time. The application server explicitly believed it was talking to an IPv4 client.

# Architecture: Protocol Translation Flow

The A10 ADC acted as the bridge. It hosted the IPv6 Virtual IP (VIP) for the internet, and the IPv4 SNAT pool for the internal server farm.

```mermaid
graph LR
    Client[Mobile User (IPv6)] -- HTTP Request --> VIP[A10 VIP (IPv6)]
    
    subgraph "A10 Thunder ADC"
    VIP -- Translation Engine --> SNAT[SNAT Pool (IPv4)]
    end
    
    SNAT -- Forwarded Request --> Server[Backend Server (IPv4)]
    Server -- Response --> SNAT
    SNAT -- Translations --> Client
```

# Business Impact

* **Continuity:** Enabled millions of mobile users to access the banking app seamlessly. The customer base grew by 15% due to better accessibility.
* **Cost Savings:** Saved millions in development costs by avoiding a full backend rewrite.
* **Performance:** By offloading SSL termination to the A10s during this project, we also reduced backend server CPU load by **30%**, extending the life of the existing hardware.
