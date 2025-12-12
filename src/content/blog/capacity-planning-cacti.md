---
title: "Capacity Planning with Cacti: Predicting the Bandwidth Cliff"
date: 2013-02-15T09:00:00+05:30
draft: false
tags: ["Capacity Planning", "Networking", "Operations", "Cacti", "Career"]
summary: "In the pre-cloud era, a 1 Gbps link was exactly 1 Gbps. If traffic hit 1.1 Gbps, the network broke. Here is how I used Cacti trend lines to predict a bandwidth cliff and preventing a catastrophic outage."
---

> "Averages are comfortable liars. If a link is idle for 12 hours and 100% saturated for 12 hours, the average is 50%. The dashboard says Green, but your customers are screaming."

In the pre-cloud era, a 1 Gbps link was a hard ceiling. If traffic hits 1.1 Gbps, packets drop.

# The Tool: Cacti

We relied on **Cacti** (RRDTool) to poll interfaces via SNMP every 5 minutes.
To untrained eyes, the graphs look like mountains. To an architect, they are a narrative of human behavior.

---

# The Analysis: The Bandwidth Cliff

I never looked at "Average." I looked at **95th Percentile** (Sustained Peak).
And I looked at the **Slope**.

One spring, I saw a trend. Traffic was growing 5% week-over-week.

* **My Projection**: We would hit total saturation ("The Cliff") by **July 1st**.

# The Silent Win

I showed management the math. "We need to sign the PO today."
We upgraded the circuit two weeks early.

On July 1st, traffic surged across the old 1 Gbps limit. **No packets dropped.**

### Key Takeaway

**In Operations, silence is the only true applause.**

Real capacity planning isn't looking at where you are *today*. It's looking at where you will be *next month*.
