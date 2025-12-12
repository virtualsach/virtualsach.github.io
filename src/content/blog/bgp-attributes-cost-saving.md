---
title: "BGP Attributes: Using Local Pref to Save Bandwidth Costs"
date: 2014-01-20T09:00:00+05:30
draft: false
tags: ["Networking", "BGP", "ISP", "Cost Optimization", "Career"]
summary: "I learned very quickly that BGP isn't just a routing protocol. It is a financial instrument. Here is how we used Local Pref to slash bandwidth costs."
---

In the world of ISPs and large enterprises, bandwidth is not an infinite resource—it is a line item on a spreadsheet, and usually the biggest one.

During my time at Net4 and Spectranet, our biggest Operating Expense (OpEx) was the monthly bill we paid to our upstream transit providers. When you are moving Terabytes of data, even a marginal difference in cost-per-Mbps can swing the company’s profitability.

I learned very quickly that **BGP (Border Gateway Protocol)** isn't just a routing protocol. It is a financial instrument.

Here is how we used BGP attributes to slash our bandwidth costs without sacrificing performance.

## The Scenario: The Multi-Homing Dilemma

We were a classic Multi-Homed Autonomous System (AS). We had connections to multiple upstream providers:

* **Provider A (The "Premium" Link)**: Tier-1 global carrier. Low latency, incredible stability, but expensive per Mbps.
* **Provider B (The "Budget" Link)**: A local exchange or lower-tier provider. Higher latency, occasional jitter, but significantly cheaper (or flat-rate bulk pricing).

**The Problem**: By default, BGP looks for the shortest AS Path. It doesn't care about your budget. If the "Premium" link offered a slightly shorter path to a bandwidth-heavy destination (like a YouTube CDN or Netflix Open Connect appliance), BGP would blindly send all that bulk traffic over the expensive pipe. We were burning money to deliver cat videos in 4K.

## The Fix: Engineering Traffic Flow

To solve this, we had to stop thinking about IP addresses and start thinking about **traffic types**. We needed "Premium" traffic (VoIP, gaming, banking) on Provider A, and "Bulk" traffic (streaming, downloads) on Provider B.

We utilized two key BGP attributes: **Local Preference (Local_Pref)** for outbound traffic and **AS Path Prepending** for inbound traffic.

### 1. Controlling Outbound: The Power of Local_Pref

`Local_Pref` is the most powerful tool for influencing how traffic *leaves* your network. It is a value local to your AS; it doesn't leave your borders. The default is 100, and higher is better.

We identified the prefixes for major content providers (Google, Netflix, Akamai). We then created a route-map to tag these prefixes with a higher Local_Pref when learned via our Cheap Link.

```cisco
! Cisco IOS Syntax Example
route-map PREFER_CHEAP_LINK permit 10
 match ip address prefix-list BULK_TRAFFIC_CDNS
 set local-preference 200
!
router bgp 65000
 neighbor 1.1.1.1 route-map PREFER_CHEAP_LINK in
```

This simple configuration forced our routers to send requests for these services out through the cheap pipe.

### 2. Controlling Inbound: The Art of AS Path Prepending

Outbound is easy; Inbound is where it gets tricky. We needed the internet to send traffic *back* to us via the cheap link.

To do this, we made the expensive link look less attractive. BGP selects the path with the fewest number of Autonomous Systems (AS hops). By "**prepending**" (repeating) our own AS number multiple times on the advertisements we sent to the Premium Provider, we artificially inflated the path length.

To the outside world, the path via our Premium Provider looked "longer" and "worse" than the path via our Budget Provider. The result? The internet naturally shifted the heavy return traffic to the cheap link.

## The Result

The impact was immediate.

* **Cost Reduction**: We successfully offloaded about 60-70% of our heavy, latency-insensitive traffic (bulk downloads/streaming) to the cheaper link.
* **Performance Check**: Because we kept the Premium link uncongested, our latency-sensitive applications (VoIP, SSH sessions) actually performed better because they weren't fighting for bandwidth against Netflix streams.

## The Takeaway

There is a misconception that "good engineering" always means "fastest path." That is false. Good engineering is about efficiency.

Routing isn't just about connectivity; it's about economics.

As a Network Architect, your job isn't just to make sure packets get from A to B. It’s to make sure they get there in a way that keeps the CFO happy. If you aren't looking at your BGP tables with a dollar sign in mind, you aren't optimizing the network—you're just connecting wires.
