---
title: "The Day RANCID Saved the Network"
date: 2012-09-15
description: "A junior engineer wiped the BGP config on our Core Router. The backup was missing. Panic ensued. Here is how RANCID (Really Awesome New Cisco ConfIg Differ) saved the day."
draft: false
tags: ["cisco", "rancid", "automation", "backup", "net4", "bgp"]
---

It was September 2012. I was an Assistant Manager at Net4 India. It was a quiet Tuesday morning until the NOC screens turned red.

A junior engineer had logged into the Core Router (Cisco 7609) to add a static route. Instead of pasting one line, he accidentally pasted a partial config buffer from his clipboard.

**He wiped the BGP neighbor statements.**

The routing table vanished. A major region went dark.

## The Panic

"Where is the backup?" I asked.
"I... I didn't take one locally," he stammered.

The router was live, but it was lobotomized. Writing a BGP config from memory for a Core Router with 4 upstream providers and 50 downstream peers is impossible.

## The Hero: RANCID

I remembered that I had deployed **RANCID (Really Awesome New Cisco ConfIg Differ)** the month before. It was a Perl script that logged into routers every hour, grabbed the config, and committed it to a CVS repository.

I SSH'd into the RANCID server.

```bash
rancid-run -r core-router-01
cvs diff -r HEAD -r HEAD~1 router.db
```

## The Recovery

The screen filled with the beautiful green text of the deleted config.

```diff
Index: core-router-01
===================================================================
< router bgp 65000
<  neighbor 1.1.1.1 remote-as 100
<  neighbor 1.1.1.1 description UPSTREAM_ISP_A
<  neighbor 2.2.2.2 remote-as 200
<  neighbor 2.2.2.2 description UPSTREAM_ISP_B
---
> ! (No BGP Configuration)
```

I copied the "missing" lines (the `<` entries), pasted them back into the router console, and hit enter.

**BGP Established.** The traffic flowed. The screens turned green.

## The Lesson

**Version control isn't just for code; it's for infrastructure.**

Never touch a router without a commit history. If you are making changes manually without an automated backup running in the background, you are just one `Ctrl+V` away from a resume-generating event.
