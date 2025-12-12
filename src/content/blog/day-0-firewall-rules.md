---
title: "Day 0 Firewall Rules: Migrating 'Black Box' Workloads Without Breaking Them"
date: 2019-10-15
description: "We lifted and shifted 100 legacy VMs to the Cloud with zero documentation. Applying Zero Trust immediately would have been suicidal. Here is how we used the 'Any-Any-Log' strategy to discover the flows."
draft: false
tags: ["nsx", "security", "firewall", "migration", "log-insight", "ibm"]
---

It was October 2019. We had just "Lifted and Shifted" 100 legacy VMs from a generic data center to a secure IBM Cloud Private instance.

**The Problem:** The application owners had no idea how their apps worked. No diagrams. No port lists. Nothing. They just knew "it works."

**The Risk:** The mandate was "Zero Trust." But if I applied a "Default Deny" policy on Day 1, I would cause a massive outage and likely be escorted out of the building.

## The Strategy: Day 0 vs. Day 1 Policy

We adopted a **Day 0 (Discovery)** strategy.

### Step 1: The 'Any-Any-Log' Rule

At the top of the NSX Distributed Firewall (DFW) for this tenant, I created a temporary rule:

* **Source**: Tenant_Security_Group
* **Destination**: Any
* **Service**: Any
* **Action**: **Allow**
* **Log**: **Enabled**

This ensured traffic flowed, but more importantly, it ensured *every single connection* generated a Syslog entry.

### Step 2: The Data Gathering (Log Insight)

We let the application run for 7 days (to catch weekly batch jobs). I fed the DFW logs into **vRealize Log Insight**.

The raw logs were a firehose. I needed to find the unique flows.
I used the Interactive Analytics feature to group by **Destination Port**.

**The Query:**

```text
filters: rule_id = "1001" (The Any-Any-Log Rule)
group_by: destination_port
sort_by: count (descending)
```

**The Results:**
Top hits:

1. TCP/443 (HTTPS) - Expected.
2. TCP/1433 (SQL) - Expected.
3. **TCP/9090** (???) - Unexpected.
4. **UDP/123** (NTP) - Forgot about that.

That `TCP/9090` turned out to be a hardcoded internal API talker that wasn't documented anywhere.

### Step 3: The Day 1 Policy (Lockdown)

Armed with this data, I built the precise Allow Rules for 443, 1433, 9090, and NTP.
Then, I switched the "Any-Any-Log" rule to **Drop**.

## The Lesson

**Discovery is the first phase of Security.**
You cannot secure what you do not understand. If you rush to "Block" without listening to the network first, you are not a Security Engineer; you are an Obstructionist.
