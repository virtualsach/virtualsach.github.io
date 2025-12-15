---
title: "Scaling to 5k Tenants: Tier-3 Data Center & IPv6 Design"
date: 2012-06-20
description: "Designed and built two Tier-3 Data Centers from the ground up to support a rapidly growing ISP. Implemented a future-proof Dual-Stack (IPv4/IPv6) BGP architecture."
summary: "Ground-up design of Tier-3 Data Centers with Dual-Stack BGP architecture."
role: "Data Center Solutions Architect"
tags: ["cisco", "juniper", "bgp", "data-center", "ipv6", "isp", "case-study"]
---

> "Most ISPs were dragging their feet on IPv6. We decided to enable Native IPv6 from Day 1."

# The Challenge

**Net4 India** was growing exponentially. We needed to support thousands of new VPS customers and Managed Services clients.

Our existing infrastructure was fragmented and running out of capacity.

**The Requirements:**

* **Scale:** Support **5,000+** new tenants.
* **Resilience:** **Tier-3 standards** (N+1 redundancy everywhere).
* **Future-Proofing:** The global **IPv4** pool was exhausting. We needed to be ready for the next generation of the internet.

---

# The Solution

I led the ground-up design of two new Data Centers in Delhi and Chennai.

## Tech Stack

* **Core Routing:** **Cisco ASR 9000 Series** (Edge) & **Nexus 7000** (Core)
* **Security:** **Juniper SRX** High-End Firewalls
* **Monitoring:** **Observium** (SNMP) & **RANCID** (Config Backup)
* **Protocol:** **Dual-Stack BGP** (IPv4 + IPv6)

## Technical Deep Dive

We moved away from a flat Layer 2 network to a robust **Layer 3 Clos Fabric**.

1. **Edge Layer:** **Cisco ASRs** peering with multiple upstream providers (Tata, Airtel, Vodafone) receiving full internet routing tables.
2. **Core Layer:** **Cisco Nexus 7000s** handling internal high-speed switching using **OSPFv3** as the IGP.
3. **Aggregation Layer:** Distributing traffic to customer racks via redundant **10G links**.

**Key Innovation: Day 1 Dual-Stack**
Every VLAN, every router interface, and every customer handoff was configured with both `0.0.0.0/0` and `::/0` reachability.

### BGP Architecture Diagram

```mermaid
graph TD
    subgraph "External Connectivity"
    ISP1[Upstream: Tata] --- Edge1[Cisco ASR 9006]
    ISP2[Upstream: Airtel] --- Edge2[Cisco ASR 9006]
    end

    subgraph "Core Switching (OSPFv3)"
    Edge1 === Core1[Nexus 7010]
    Edge2 === Core2[Nexus 7010]
    Core1 === Core2
    end

    subgraph "Customer Access"
    Core1 --- Agg1[Aggregation Sw]
    Core2 --- Agg2[Aggregation Sw]
    Agg1 --- Rack[Server Racks]
    Agg2 --- Rack
    end
```

# Business Impact

* **Capacity:** Enabled the onboarding of **5,000+ new VPS customers**, driving significant revenue growth.
* **Resilience:** Achieved **99.999% network uptime** during the first year of operations.
* **Readiness:** Fully compliant with government **IPv6 mandates** while competitors scrambled to upgrade.
