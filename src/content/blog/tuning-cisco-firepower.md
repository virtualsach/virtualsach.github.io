---
title: "Tuning Cisco Firepower: When the IPS Blocks the CEO"
date: 2016-11-10
description: "We deployed Cisco Firepower NGIPS in Inline Mode. It immediately blocked the CEO's access to the database. Here is how we used Snort SIDs and Impact Flags to fix the false positive."
draft: false
tags: ["cisco", "firepower", "ips", "snort", "security", "wipro"]
---

> "We were feeling brave, so we deployed in Inline Mode. Ten minutes later, the Application Lead called: 'The CEO can't access the Sales Dashboard.'"

It was November 2016. We had just deployed a brand new **Cisco Firepower NGIPS**.

# The Incident

We checked the Connection Events. A massive sea of red `DROP` actions coming from the CEO's subnet.
**The Trigger:** `SQL Injection Attempt (gid:1, sid:12345)`

The dashboard app was syncing data using a legacy method that included unsanitized strings in the URL. To Firepower, this looked exactly like a hacker.

---

# The Analysis: Impact Flags

Firepower assigns an **Impact Flag** (0-4) to every event.
Because Firepower knew the destination server was running Oracle DB, it flagged the Impact as **2 (High)**.

It was doing exactly what we told it to do: Block bad things.

# The Fix: Tuning

The knee-jerk reaction would be to disable the rule globally. But that would leave the bank open to *actual* SQL injections.

Instead, we tuned the policy based on trust.

1. Identified the specific **Snort Signature ID (SID)**.
2. Created a **Pass Rule** for the database server IPs.
3. **Logic**: `If Source = Trusted_App_Server AND Rule = SID:12345, Action = PASS`.

### Key Takeaway

**IPS out of the box is a denial of service waiting to happen.**

Security tools lack context. Never deploy in Inline Mode on Day 1. Run in Passive Mode, tune the false positives, and *then* take the gloves off.
