---
title: "The Night the Fiber Cut: Lessons in WAN Redundancy"
date: 2011-07-10T09:00:00+05:30
draft: false
tags: ["Networking", "Disaster Recovery", "NOC", "Real Stories", "Career"]
summary: "The primary fiber was dead. The backup links were stalling. I learned a lesson that no textbook could teach: Redundancy is only real if you test it."
---

It was 2:00 AM on a Tuesday. The Network Operations Center (NOC) was silent—the kind of silence that makes you suspicious. I was halfway through a stale coffee when the silence shattered.

First, the SNMP traps started screaming. Then, the dashboard monitors flipped from soothing green to violent, flashing red. Finally, the phones started ringing. All of them. At once.

**Primary Link Down.**

We didn't need a diagnostic tool to tell us what happened. Somewhere out in the dark streets of the city, a construction crew operating a JCB excavator had just found our primary fiber bundle. The "JCB Backhoe" is the apex predator of the networking world, and it had just taken a bite out of our backbone.

## The Panic

"Failover initiated," someone shouted. "Backup links coming up!"

I looked at the bandwidth graphs. We had lost 60% of our capacity instantly. The primary fiber was dead, severed by brute force. We had backup RF (Radio Frequency) and WiMAX links standing by for exactly this scenario.

But nothing was moving.

The traffic wasn't shifting. The packets were dropping into a black hole. OSPF (Open Shortest Path First) was supposed to detect the failure and reconverge instantly. It was supposed to route around the damage.

Instead, it was choking. The timers were off. The metric calculations were stalling. We were bleeding data, and 40% of our customer base was offline.

## The Manual Override

I couldn't wait for the protocol to wake up. We didn't have minutes; we had seconds before our SLAs (Service Level Agreements) were breached and the penalties started rolling in.

"I'm going manual!" I yelled over the noise of the NOC.

I pulled up the terminal for the edge routers. My hands were shaking slightly—not from fear, but from adrenaline. This was it. The automation had failed. It was Man vs. Machine.

The backup RF links were live, but OSPF wasn't redistributing the routes correctly. The routers didn't trust the backup path yet. I had to force them.

I hammered the keyboard, bypassing the dynamic routing logic.

```cisco
router bgp 65000 
 redistribute ospf 1 route-map FORCE_BACKUP
 clear ip bgp * soft
```

I manually manipulated the BGP route redistribution, grabbing the prefixes by the throat and shoving them onto the lower-bandwidth WiMAX and RF interfaces. It was a risky move—jamming gigabytes of traffic onto a smaller pipe—but it was better than a complete blackout.

## The Converge

I hit Enter.

For three agonizing seconds, the cursor blinked.

Then, the graphs twitched. The flatline on the backup links spiked upward. Traffic started flowing. The red alerts on the dashboard flickered and stabilized.

We were slower, we were congested, but we were alive. The data was moving.

## The Lesson

I collapsed back into my chair, the adrenaline crash hitting me like a truck. We survived the night, but I learned a lesson that no textbook could teach.

We had "redundancy" on paper. We had diagrams showing backup links. We had expensive routers configured to failover. But it didn't work when it mattered.

Redundancy is only real if you test it.

If you haven't pulled the plug on your primary link during a maintenance window and watched the failover happen with your own eyes, you don't have redundancy. You have a hope and a prayer.

**If you haven't failed over, you aren't redundant.**
