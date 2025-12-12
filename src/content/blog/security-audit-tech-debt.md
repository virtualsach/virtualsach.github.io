---
title: "Security Audits: Cleaning Up 5 Years of Technical Debt"
date: 2015-08-20
description: "We found a 'permit ip any any' rule hidden at the bottom of a client's firewall policy. It was a temporary fix from 2012. Here is how we fixed it without breaking production."
draft: false
tags: ["security", "firewall", "audit", "technical-debt", "wipro", "splunk"]
---

It was August 2015. We had just taken over the management of a client's network infrastructure. As part of the onboarding, I was running a standard audit of their Checkpoint and ASA firewall policies.

I scrolled to the bottom of the DMZ firewall policy, expecting to see the standard `deny any any log`.

Instead, I saw this:
`access-list DMZ_IN extended permit ip any any log`

Desciption: "Temporary fix for App Migration - 2012"

It was 2015. That "temporary" fix had been bypassing the entire security posture of the DMZ for three years.

## The Risk

The client was horrified. "Just delete it!" the CISO demanded.

"I can't," I said. "If legitimate traffic is using that rule today—even if it shouldn't be—deleting it will cause an outage."

We had a classic case of **Security vs. Availability**. We needed to close the hole, but we couldn't break the business.

## The Fix: Hit Count Analysis

We couldn't guess what traffic was hitting that rule. We had to measure it.

### Step 1: Enable Logging

The rule already had `log` enabled, which was the only saving grace. This meant every packet hitting this "Any-Any" rule was generating a syslog message.

### Step 2: The Splunk Query

We forwarded the logs to Splunk. I didn't want to see *all* traffic, just the unique flows.

I set up a search to aggregate the data over 30 days:

```splunk
index=firewall action=allowed rule_name="DMZ_ANY_ANY"
| stats count by src_ip, dst_ip, dst_port
| sort - count
```

### Step 3: Analysis & Rule Creation

The results were eye-opening.

1. **Noise**: 80% of the traffic was junk—scanners, misconfigured servers trying to talk to decommissioned IPs.
2. **Legitimate Traffic**: There were 3 critical application flows relying on this rule. Specifically, a legacy payment gateway on `TCP/8443` that had never been properly documented.

We created specific allow rules for those 3 legitimate flows and placed them *above* the Any-Any rule.

## The Cleanup

After 30 days, we watched the hit count on the Any-Any rule. It didn't drop to zero (because of the junk traffic), but the *legitimate* IP pairs stopped appearing in the logs. They were now matching the specific rules we created.

On a Sunday morning maintenance window, we finally deleted the "Temporary Fix."

## The Lesson

**There is nothing more permanent than a temporary fix.**

Technical debt in code slows you down. Technical debt in security policies exposes you to catastrophic risk. If you make a temporary hole in your firewall, put a calendar reminder to close it. Better yet, automate the expiry.
