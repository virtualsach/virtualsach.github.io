---
title: "Tuning Cisco Firepower: When the IPS Blocks the CEO"
date: 2016-11-10
description: "We deployed Cisco Firepower NGIPS in Inline Mode. It immediately blocked the CEO's access to the database. Here is how we used Snort SIDs and Impact Flags to fix the false positive."
draft: false
tags: ["cisco", "firepower", "ips", "snort", "security", "wipro"]
---

It was November 2016. We had just deployed a brand new Cisco Firepower NGIPS solution for a financial client. We were feeling brave, so we deployed it in **Inline Mode** (blocking) instead of Passive Mode.

Ten minutes later, the phone rang. It was the Application Lead.
*"The CEO can't access the Sales Dashboard. It's loading blank."*

## The Incident

We checked the Firepower Connection Events. There it was. A massive sea of red `DROP` actions coming from the CEO's subnet destined for the SQL Database.

**The Trigger:** `SQL Injection Attempt (gid:1, sid:12345)`

The dashboard application was syncing data using a legacy method that included unsanitized strings in the URL. To Firepower, this looked exactly like a hacker trying to dump the database table.

## The Analysis: Context Matters

Firepower assigns an **Impact Flag** to every event, ranging from 0 (No Impact) to 4 (Critical).
Because Firepower knew the destination server was running Oracle DB (via its passive discovery), and the signature target was generic SQL, it flagged the Impact as **2 (High)**.

It was doing exactly what we told it to do: Block bad things.

## The Fix: Tuning, Not Disabling

The knee-jerk reaction would be to disable the rule globally. But that would leave the bank open to *actual* SQL injections.

Instead, we tuned the policy based on trust.

1. I identified the specific **Snort Signature ID (SID)** triggering the drop.
2. I created a **Pass Rule** (Allow List) specifically for the database server IPs.
3. Rule Logic: `If Source = Trusted_App_Server AND Rule = SID:12345, Action = PASS`.

## The Lesson

**IPS out of the box is a denial of service waiting to happen.**
Security tools lack context. They don't know that *this* specific ugly packet is actually your mission-critical legacy app. You have to teach them.

Never deploy in Inline Mode on Day 1. Run in Passive Mode, tune the false positives, and *then* take the gloves off.
