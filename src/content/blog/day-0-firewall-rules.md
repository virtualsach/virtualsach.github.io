---
title: "Day 0 Firewall Rules: Migrating 'Black Box' Workloads Without Breaking Them"
date: 2019-10-15
description: "We lifted and shifted 100 legacy VMs to the Cloud with zero documentation. Applying Zero Trust immediately would have been suicidal. Here is how we used the 'Any-Any-Log' strategy to discover the flows."
draft: false
tags: ["nsx", "security", "firewall", "migration", "log-insight", "ibm"]
---

> "The application owners had no idea how their apps worked. No diagrams. No port lists. But the mandate was 'Zero Trust'."

It was October 2019. We had just "Lifted and Shifted" 100 legacy VMs to a secure IBM Cloud Private instance.

**The Risk:** If I applied a "Default Deny" policy on Day 1, I would cause a massive outage.

---

# The Strategy: Day 0 vs. Day 1

We adopted a **Day 0 (Discovery)** strategy.

## Step 1: The 'Any-Any-Log' Rule

At the top of the **NSX Distributed Firewall**, I created a temporary rule:

* **Action**: Allow
* **Log**: **Enabled**

This ensured traffic flowed, but *every connection* generated a Syslog entry.

## Step 2: The Data Gathering

I fed the DFW logs into **vRealize Log Insight** and ran an aggregation query:

```text
filters: rule_id = "1001" (The Any-Any-Log Rule)
group_by: destination_port
sort_by: count (descending)
```

**The Results:**

1. TCP/443 (HTTPS) - Expected.
2. **TCP/9090** (???) - Unexpected.
3. **UDP/123** (NTP) - Forgot about that.

That `TCP/9090` was a hardcoded internal API talker documented nowhere.

## Step 3: The Lockdown

Armed with this data, I built the precise Allow Rules.
Then, I switched the "Any-Any-Log" rule to **Drop**.

### Key Takeaway

**Discovery is the first phase of Security.**

You cannot secure what you do not understand. If you rush to "Block" without listening to the network first, you are not a Security Engineer; you are an Obstructionist.
