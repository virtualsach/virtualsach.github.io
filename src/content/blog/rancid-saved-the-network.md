---
title: "The Day RANCID Saved the Network"
date: 2012-09-15
description: "A junior engineer wiped the BGP config on our Core Router. The backup was missing. Panic ensued. Here is how RANCID (Really Awesome New Cisco ConfIg Differ) saved the day."
draft: false
tags: ["cisco", "rancid", "automation", "backup", "net4", "bgp"]
---

> "The routing table vanished. A major region went dark. 'Where is the backup?' I asked. 'I... I didn't take one,' he stammered."

It was September 2012. A junior engineer had logged into the **Cisco 7609 Core Router**.

Instead of pasting one static route, he accidentally pasted a partial config buffer.
**He wiped the BGP neighbor statements.**

---

# The Hero: RANCID

I remembered that I had deployed **RANCID** (Really Awesome New Cisco ConfIg Differ) the month before. It logged into routers every hour and committed configs to a **CVS repository**.

I SSH'd into the server:

```bash
rancid-run -r core-router-01
cvs diff -r HEAD -r HEAD~1 router.db
```

# The Recovery

The screen filled with the beautiful green text of the deleted config.

```diff
< router bgp 65000
<  neighbor 1.1.1.1 remote-as 100
<  neighbor 1.1.1.1 description UPSTREAM_ISP_A
```

I copied the missing lines, pasted them into the router console, and hit enter.

**BGP Established.** The traffic flowed.

### Key Takeaway

**Version control isn't just for code; it's for infrastructure.**

Never touch a router without a commit history. If you are making changes manually without automated backups, you are one `Ctrl+V` away from a resume-generating event.
