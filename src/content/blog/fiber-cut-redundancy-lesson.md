---
title: "The Night the Fiber Cut: Lessons in WAN Redundancy"
date: 2011-07-10T09:00:00+05:30
draft: false
tags: ["Networking", "Disaster Recovery", "NOC", "Real Stories", "Career"]
summary: "The primary fiber was dead. The backup links were stalling. I learned a lesson that no textbook could teach: Redundancy is only real if you test it."
---

> "Somewhere out in the dark streets, a JCB excavator had just found our primary fiber bundle. The 'JCB Backhoe' is the apex predator of networking."

It was 2:00 AM on a Tuesday. The NOC dashboard flipped from green to violent red.
**Primary Link Down.** We lost 60% of capacity instantly.

# The Panic

We had backup RF and WiMAX links standing by. **OSPF** was supposed to reconverge instantly.
**It choked.**

The metric calculations stalled. We were bleeding data, and 40% of our customers were offline. We didn't have minutes; we had seconds before SLA penalties hit.

---

# The Manual Override

I couldn't wait for the protocol. I yelled, "I'm going manual!"

I pulled up the Edge Router terminal. I had to force the BGP routes onto the backup interfaces.

```cisco
router bgp 65000 
 redistribute ospf 1 route-map FORCE_BACKUP
 clear ip bgp * soft
```

I hit Enter.
For three agonizing seconds, the cursor blinked.

**Then, the graphs spiked.** Traffic started flowing. We were congested, but we were alive.

### Key Takeaway

**Redundancy is only real if you test it.**

We had redundancy on paper. We had diagrams. But we hadn't tested the failover under load.
If you haven't pulled the plug on your primary link during maintenance and watched it switch over, you don't have redundancy. You have a prayer.
