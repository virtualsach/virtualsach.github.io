---
title: "The Route Redistribution Loop that Took Down the Core"
date: 2011-12-15T09:00:00+05:30
draft: false
tags: ["Networking", "BGP", "OSPF", "Outage", "Lessons Learned"]
summary: "I effectively DDoS-ed our own control plane from the inside. Here is the story of how I melted a core router by forgetting one line of code."
---

> "There are two kinds of Network Engineers: those who have caused a network-wide outage, and those who will."

I earn my badge at **Spectranet**. The task was simple: Redistribute a specific customer BGP block into OSPF.

# The Mistake

I logged into the Core Router. My fingers flew.

```cisco
router ospf 1 
 redistribute bgp 65000 subnets
```

I hit Enter.

**I had forgotten the Route Map.**

I told the router to take **500,000 Internet Routes** and shove them into our internal OSPF database.

---

# The Meltdown

OSPF is not designed for the internet table.

* **T-10s**: CPU spiked to 100%.
* **T-30s**: OSPF process crashed under the weight of Type-5 LSAs.
* **T-60s**: The network started flapping violently. Major outage.

**I had effectively DDoS-ed our own control plane.**

# The Fix

I couldn't issue a `no redistribute` because the CLI was unresponsive.
I had to console in and **hard-kill the BGP session**.

```cisco
clear ip bgp *
```

Once the CPU dropped, I applied the fix—the one line that would have saved me.

```cisco
redistribute bgp 65000 subnets route-map FILTER_CUSTOMER_ONLY
```

### Key Takeaway

**Measure twice, cut once.**

**NEVER redistribute BGP into an IGP without a filter.** OSPF cannot handle the internet table. If you don't filter, you don't just break the network—you melt the Core.
