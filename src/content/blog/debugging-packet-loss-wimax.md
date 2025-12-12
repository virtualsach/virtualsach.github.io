---
title: "Debugging the Air: Troubleshooting Packet Loss on WiMAX & RF Links"
date: 2011-09-15T09:00:00+05:30
draft: false
tags: ["Networking", "Wireless", "Troubleshooting", "Field Engineering", "Career"]
summary: "For thousands of customers, 'The Cloud' is a focused beam of radio waves. I learned that you can't route-map your way around a building crane."
---

> "The link was rock solid all morning. But exactly at 4:00 PM, like clockwork, the connection would choke. By 5:30 PM, it would clear up."

For enterprise customers, "The Cloud" is a focused beam of radio waves blasting through smog.
I had a ticket that haunted me.

# The Debug: CLI vs. Reality

I did what every engineer does. I blamed the router.

* **Config**: Clean.
* **Errors**: None.

From the safety of the NOC, it looked perfect. But the customer was screaming.

---

# The Climb

I climbed the customer's roof.
I looked at the **RSSI** (Signal Strength). It was fluctuating wildly. One second `-65 dBm`, the next `-85 dBm` (Silence).

**Then I saw it.**

It wasn't Rain Fade. **It was a crane.**
A construction crew swungs a crane arm right through my Line of Sight (LoS) every day at 4:00 PM to unload materials. It scattered my radio waves like a shotgun blast.

# The Fix: Wrench and Muscle

You can't fix a crane with Python.
I had to physically manhandle the antenna, searching for a new signal lobe.

* Tweak right. **Boom. -58 dBm.**

### Key Takeaway

**Always check Layer 1 first.**

You cannot code your way out of bad physics. Sometimes, you just need a wrench.
