---
title: "NAT64: How We Saved Legacy Apps in an IPv6 World"
date: 2015-10-12
description: "The client enforced an IPv6-only mandate for external apps. The backend servers were hardcoded IPv4 dinosaurs. Here is how we used A10 Thunder ADCs and NAT64 to bridge the gap."
draft: false
tags: ["ipv6", "nat64", "dns64", "a10", "load-balancing", "wipro"]
---

> "The backend servers were hardcoded IPv4 dinosaurs. Re-IPing them was a non-starter. But the client mandate was clear: 'All external-facing apps must be reachable via IPv6 by year-end.'"

It was October 2015. I was the Security Lead at **Wipro** for a major telecom client.

# The Problem

The backend infrastructure was decades old. Hardcoded IPs, legacy Java apps, and mainframes that thought "128-bit" referred to encryption keys, not IP addresses.

---

# The Solution: SLB-PT

We implemented **SLB-PT** (Server Load Balancing - Protocol Translation) on our **A10 Thunder ADCs**. This is essentially **NAT64**.

## The Flow

1. **Client (IPv6)**: `2001:db8::1` sends a request to the VIP.
2. **VIP (IPv6)**: `2001:db8::100` receives it.
3. **A10 ADC (Translation)**: Terminates the session, performs Source NAT (IPv4 pool) and Destination NAT.
4. **Server (IPv4)**: `192.168.10.50` sees a request from an internal IPv4 address.

The server never knew the client was on IPv6.

## Technical Deep Dive: NAT64 vs. DNS64

* **DNS64**: The "Phonebook." It synthesizes a fake **AAAA record** (e.g., `64:ff9b::192.168.10.50`) when only an IPv4 A record exists.
* **NAT64**: The "Translator." It strips the prefix and routes to the IPv4 address.

**The Headache: Embedded IPs**
Protocols like **FTP** and **SIP** embed IP addresses inside the payload.

* **The Fix**: Enabled **Application Layer Gateways (ALGs)** on the A10 to inspect and rewrite the payload on the fly.

### Key Takeaway

**The world isn't dual-stack yet.**

Ideally, everything would run IPv4 and IPv6 side-by-side. In reality, translation mechanisms like NAT64 are the bridge that keeps the internet working.
