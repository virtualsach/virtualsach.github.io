---
title: "The Phantom Packet Loss: Why I Always Check Duplex Settings"
date: 2011-05-10
description: "A premium customer had slow speeds and 2% packet loss. We swapped routers, fibers, and prayers. Nothing worked. The culprit? A hidden duplex mismatch."
draft: false
tags: ["cisco", "troubleshooting", "layer1", "spectranet", "networking"]
---

> "We swapped the router. Swapped the fiber. Cleaned the connectors. I was about to blame 'Sunspots' when I decided to look deeper."

It was May 2011. I was a Field Engineer at **Spectranet**. a premium enterprise customer was screaming about slow speeds.

# The Mystery

I pinged their router. **2% packet loss.** Consistently.
The bandwidth utilization was low. The CPU was idle.

---

# The Discovery: Interface Counters

I logged into our Cisco CPE and ran `show interface FastEthernet0/1`.
Most people just look at "Up/Up". I looked at the error counters.

```bash
     129384 input errors, 9832 CRC, 0 frame
     0 output errors, 4832 collisions
     2394 late collision, 0 deferred
```

**9832 CRC Errors. 2394 Late Collisions.**

# The Root Cause: Duplex Mismatch

A **Late Collision** is the smoking gun of a Duplex Mismatch.

* **Customer Side:** Hardcoded to **100/Full**.
* **Our Side:** Set to **Auto/Auto**.

When one side is fixed and the other is Auto, the Auto side defaults to **Half Duplex**.

* **Result:** Collision domains colliding. Packets dying.

# The Fix

I entered the magic commands on our side:

```bash
interface FastEthernet0/1
 speed 100
 duplex full
```

The errors stopped instantly. Packet loss dropped to 0%.

### Key Takeaway

**Auto-negotiation fails more often than you think.**

Especially with older gear. Don't trust "Up/Up". Trust the **CRC** and **Collision** counters.
