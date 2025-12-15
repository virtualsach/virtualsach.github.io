---
title: "Changing the Engines in Mid-Flight: The NSX-V to T Migration"
date: 2021-03-15
description: "How we migrated 5,000 workloads from NSX-V to NSX-T with zero significant outages."
tags: ["VMware", "NSX-T", "Migration", "BGP", "War Story"]
---

> "The hardest part of a migration isn't moving the VMs. It's moving the network without the application knowing it moved."

## The Context: 2021

We were sitting on a ticking time bomb. Our entire private cloud was built on **NSX-V** (which was effectively dead) and tied to the hip of vCenter.

Management wanted "Modern Cloud." They wanted T0 gateways, VRFs, and independence from vCenter. But they also had one non-negotiable constraint: **Zero Downtime**.

We had to swap the jet engines (the SDN layer) while the plane (the banking apps) was cruising at 30,000 feet.

## The Architecture: The HCX Bridge

The tool of choice was **VMware HCX (Hybrid Cloud Extension)**. Ideally, it's a magic button: "Click here, stretch L2, migrate VM."

In reality, it’s a complex mesh of IPsec tunnels and traffic engineering.

### The "Routing Trap"

The biggest architectural shift was moving from the **Edge Services Gateway (ESG)** model to the **T0/T1** model.

* **Old World:** ESGs were monoliths doing everything (Routing, NAT, LB, VPN).
* **New World:** T0s handled BGP north to the physical core, while T1s handled tenant routing.

We had to redesign our entire **BGP AS Number** strategy to prevent loops when we stretched the networks. We used **AS-Path Prepending** to ensure that during the migration phase, traffic preferred the old path until we were ready to cut the hard line.

## The "Oh Sh*t" Moment: The Silent Drop

Migration night, 2 AM. We stretch the first VLAN.

Connectivity looks good. Ping works. SSH works.
Then the Database team calls: *"Big queries are timing out."*

It wasn't a hard down. It was a "soft" failure.

### The Culprit: GENEVE vs. VXLAN

I grabbed the console and ran `tcpdump` on the Edge Node interfaces.

```bash
# Debugging on the Edge Node
get firewall monitor-traffic interface uuid ...
```

We saw packets leaving, but not arriving. The issue was **MTU**.

* **NSX-V** used **VXLAN** (overhead ~50 bytes).
* **NSX-T** uses **GENEVE** (overhead can be higher/flexible).

Our underlay physical switches were set to `MTU 1600`. It *should* have been enough. But the HCX tunnel added *another* layer of encapsulation (IPSec). We were exceeding the physical MTU by **4 bytes**.

Small packets (Ping/SSH) passed. Large packets (SQL queries) were silently dropped because the "Don't Fragment" (DF) bit was set.

## The Fix

We couldn't re-configure the physical core at 2 AM. So we adjusted the **MSS Clamping** on the T1 gateways to force the TCP handshake to negotiate a smaller segment size.

```bash
# The lifesaver command
set ip tcp-mss 1350
```

Traffic flowed instantly. The "soft" failure vanished.

## The Verdict

We successfully migrated **5,000 workloads** over 3 months.

* **Outages:** 0 significant data plane incidents.
* **Lesson:** "It's always MTU." And never trust the default encapsulation overhead numbers in the manual.

This migration proved that we could modernize deep infrastructure without disrupting the business. It was the end of the "Iron Age" and the beginning of the "Code Age."
