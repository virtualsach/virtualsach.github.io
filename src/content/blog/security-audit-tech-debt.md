---
title: "Security Audits: Cleaning Up 5 Years of Technical Debt"
date: 2015-08-20
description: "We found a 'permit ip any any' rule hidden at the bottom of a client's firewall policy. It was a temporary fix from 2012. Here is how we fixed it without breaking production."
draft: false
tags: ["security", "firewall", "audit", "technical-debt", "wipro", "splunk"]
---

> "Description: 'Temporary fix for App Migration - 2012'. It was 2015. That 'temporary' fix had been bypassing the entire security posture for three years."

I was auditing a client firewall. I expected `deny any`.
Instead, I found `permit ip any any`.

# The Risk

The CISO demanded: "Delete it!"
I refused. "If legitimate traffic is using that rule today, deleting it causes an outage."

We had a classic case of **Security vs. Availability**.

---

# The Fix: Hit Count Analysis

We couldn't guess. We had to measure.

### Step 1: Enable Logging

The rule had `log` enabled. Every packet was a syslog message.

### Step 2: The Splunk Query

I aggregated the data over 30 days.

```splunk
index=firewall rule_name="DMZ_ANY_ANY"
| stats count by src_ip, dst_ip, dst_port
```

### Step 3: Analysis

* **Noise**: 80% junk.
* **Legitimate**: 3 critical flows (Legacy Payment Gateway on `TCP/8443`).

We created specific Allow Rules for the legitimate flows and placed them *above* the Any-Any.

# The Cleanup

The legitimate hits on the Any-Any rule dropped to zero.
On a Sunday maintenance window, we deleted the "Temporary Fix."

### Key Takeaway

**There is nothing more permanent than a temporary fix.**

If you make a temporary hole in your firewall, put a calendar reminder to close it. Technical debt in security exposes you to catastrophic risk.
