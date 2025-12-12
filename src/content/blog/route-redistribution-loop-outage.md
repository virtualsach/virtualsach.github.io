---
title: "The Route Redistribution Loop that Took Down the Core"
date: 2011-12-15T09:00:00+05:30
draft: false
tags: ["Networking", "BGP", "OSPF", "Outage", "Lessons Learned"]
summary: "I effectively DDoS-ed our own control plane from the inside. Here is the story of how I melted a core router by forgetting one line of code."
---

There are two kinds of Network Engineers: those who have caused a network-wide outage, and those who will.

I earned my badge at Spectranet, working on the Core ISP network. We were dealing with a complex Multi-home BGP setup and needed to propagate some specific external routes into our internal OSPF domain for traffic engineering purposes.

It sounded simple enough. I’d done it a dozen times in the lab. But the lab isn't the real world.

## The Setup

The task was straightforward: Redistribute a small subset of BGP routes into OSPF so our internal distribution switches would know how to reach a specific customer block.

I logged into the Core Router—a beast of a Cisco box that handled gigabits of traffic. My fingers flew across the keyboard.

```cisco
router ospf 1 
 redistribute bgp 65000 subnets
```

I hit Enter.

## The Mistake

If you are a seasoned engineer, you likely just winced reading those two lines of code.

You noticed what was missing. I didn't.

**I had forgotten the Route Map.**

In my haste, I didn't apply a route-map or a prefix-list to filter which BGP routes were redistributed. I told the router to take **every single route** in the BGP table (the full internet routing table, over 500,000 routes at the time) and shove them into our internal OSPF database.

## The Impact: The Meltdown

OSPF (Open Shortest Path First) is a link-state protocol. It relies on every router having an identical map of the network (the LSDB). It is designed to handle thousands of routes, not hundreds of thousands.

The moment I hit enter, the Core Router tried to generate hundreds of thousands of Type-5 LSAs (External LSAs).

* **T-minus 5 seconds**: The CLI became sluggish.
* **T-minus 10 seconds**: The CPU utilization on the Core Router spiked to 100%.
* **T-minus 30 seconds**: The OSPF process crashed under the weight of the database. Adjacencies with neighbor routers started dropping.
* **T-minus 60 seconds**: The network started flapping violently. Routes were appearing and disappearing. Traffic across the entire city ground to a halt.

I had effectively DDoS-ed our own control plane from the inside.

## The Fix

Panic is a cold feeling. But training kicks in.

I couldn't even issue a `no redistribute` command because the CLI was unresponsive due to the CPU spike. The router was too busy processing the LSAs to listen to me.

I had to go nuclear. I managed to console into the device (which has higher interrupt priority) and hard-killed the BGP session entirely to stop the influx of routes.

```cisco
clear ip bgp *
```

The CPU dropped. The LSAs timed out. The network gasped and started to breathe again.

Once stability returned, I applied the fix—the one line of code that would have saved me 20 minutes of terror:

```cisco
redistribute bgp 65000 subnets route-map FILTER_CUSTOMER_ONLY
```

## The Lesson

I walked away from that terminal with shaking hands and a lesson burned into my brain.

**"Measure twice, cut once."**

And more specifically: **NEVER redistribute BGP into an IGP (like OSPF or EIGRP) without a filter.**

IGPs are not designed to hold the internet. They are designed for speed and topology awareness. When you bridge the gap between the massive scale of BGP and the precise mechanics of OSPF, you must be the gatekeeper.

If you don't filter, you don't just break the network—you melt it.

---

## 🛡️ The "Don't Melt the Core" Redistribution Checklist

Before you hit Enter on that redistribute command, run through this list. Every single time.

### Phase 1: The Recon (Pre-Configuration)

* [ ] **Check Source Table Size**: Run `show ip bgp summary` or `show ip route bgp`. Ask: Am I about to dump 900,000 routes? or just 5?
* [ ] **Check Destination Capacity**: Know the limits of your IGP (OSPF/EIGRP) and the hardware. *Rule of Thumb: OSPF gets cranky over 10k-20k routes depending on the hardware.*
* [ ] **Check CPU Status**: Run `show processes cpu history`. *Warning: If the router is already idling at 60%, do not perform a redistribution without a maintenance window.*

### Phase 2: The Gatekeeper (The Filter)

* [ ] **Build the Prefix-List**: Do not rely on ACLs for route filtering; they are messy. Use a prefix-list.

    ```cisco
    ip prefix-list REDIST_FILTER permit 10.x.x.x/24
    ```

- [ ] **Build the Route-Map**: Always wrap your list in a route-map.

    ```cisco
    route-map BGP_TO_OSPF permit 10
     match ip address prefix-list REDIST_FILTER
    ```

- [ ] **The Safety Net (Implicit Deny)**: Remember that route-maps have an implicit deny at the end, but adding an explicit deny line (`route-map BGP_TO_OSPF deny 20`) is good documentation and prevents accidents if you add more permit statements later.

### Phase 3: The Execution

* [ ] **Apply the Filter FIRST**: Type the full command including the route-map before hitting enter.
  * ❌ `redistribute bgp 65000` (DO NOT PRESS ENTER)
  * ✅ `redistribute bgp 65000 subnets route-map BGP_TO_OSPF`
* [ ] **Console Access**: If you are doing this remotely on a critical core router, are you prepared to lose SSH? Do you have out-of-band management (Console server/Terminal server) access ready?

### Phase 4: The Verification

* [ ] **Check the LSA/Topology Table**: `show ip ospf database external`. Did you see only the specific routes you wanted? Or did the counter explode?
* [ ] **Watch the CPU**: Keep a `show processes cpu sorted 1min` running. If OSPF Router process spikes and stays high, undo immediately.
