---
title: "NAT64: How We Saved Legacy Apps in an IPv6 World"
date: 2015-10-12
description: "The client enforced an IPv6-only mandate for external apps. The backend servers were hardcoded IPv4 dinosaurs. Here is how we used A10 Thunder ADCs and NAT64 to bridge the gap."
draft: false
tags: ["ipv6", "nat64", "dns64", "a10", "load-balancing", "wipro"]
---

It was October 2015. I was the Security Lead at Wipro for a major telecom client. They had just issued a mandate: *"All external-facing applications must be reachable via IPv6 by year-end."*

The Problem: The backend infrastructure was decades old. Hardcoded IPs, legacy Java apps, and mainframes that thought "128-bit" referred to encryption keys, not IP addresses. Re-IPing the backend to IPv6 was a non-starter.

## The Solution: SLB-PT (Server Load Balancing - Protocol Translation)

We implemented **SLB-PT** on our A10 Thunder ADCs. This is essentially **NAT64**.

**The Flow:**

1. **Client (IPv6)**: `2001:db8::1` sends a request to the VIP.
2. **VIP (IPv6)**: `2001:db8::100` receives it.
3. **A10 ADC (Translation)**: Terminates the session, performs Source NAT (using an IPv4 pool) and Destination NAT (to the specific backend server).
4. **Server (IPv4)**: `192.168.10.50` sees a request coming from an internal IPv4 address.

The server never knew the client was on IPv6. The client never knew the server was on IPv4.

## The Technical Deep Dive: NAT64 vs. DNS64

The most confusing part for the team was understanding the two components needed to make this work.

* **DNS64**: This is the "Phonebook." When an IPv6 client asks for the AAAA record of `legacy-app.com`, the DNS64 server sees that only an A record (IPv4) exists. It synthesizes a fake AAAA record (e.g., `64:ff9b::192.168.10.50`) and gives it to the client.
* **NAT64**: This is the "Translator." When the client tries to connect to that fake `64:ff9b::` address, the network routes it to the A10 ADC, which strips off the prefix and routes the packet to the actual IPv4 address.

You generally need both. DNS64 tricks the client into initiating the connection; NAT64 handles the actual packets.

## The Headache: Protocols that Embed IPs

HTTP was easy. **FTP and SIP** were nightmares.
These protocols embed IP addresses inside the payload (e.g., FTP `PORT` command). The ADC would translate the packet header, but the payload would still contain the IPv6 address, confusing the IPv4 server.

**The Fix**: capabilities of the A10 have widely known as **Application Layer Gateways (ALGs)**. We had to enable specific ALGs that inspect the payload and rewrite the IP addresses inside the data stream on the fly.

## The Lesson

**The world isn't dual-stack yet.**
Ideally, everything would run IPv4 and IPv6 side-by-side. In reality, translation mechanisms like NAT64 are the bridge that keeps the internet working while we slowly retire the legacy world.
