---
title: "CSI Data Center: Forensic Analysis with vRealize Log Insight"
date: 2021-04-12
description: "Storage latency was spiking every night at 2:15 AM. The Storage Team blamed the Network. The Network Team blamed the Storage. I used vRLI to find the smoking gun."
draft: false
tags: ["vrli", "logging", "forensics", "troubleshooting", "vmware", "ntt-data"]
---

> "Every night at 02:15 AM, the Storage Latency spiked. The Blame Game began. Storage blamed Network. Network blamed Storage."

It was April 2021. We had a haunting in the Data Center.
Every night, latency hit **200ms+**, causing VMs to stun/freeze.

# The Investigation: vRealize Log Insight (vRLI)

I decided to stop guessing. I pointed logs from **vCenter**, the **Storage Array**, and **Backup Servers** to **vRLI**.

## The Correlation

I didn't search for an error. I searched for **Time**.
I built a query for the 5-minute window between **02:10 AM and 02:15 AM**.

**The Query Construction:**

* **Time Range**: Custom (02:10 - 02:15)
* **Group By**: `hostname`
* **Visual**: Event Types over Time

# The Smoking Gun

The chart showed a spike of events.

1. **02:14:59**: Backup Server `bkp-test-01` logs: `Job 'Full_VM_Backup' Started`.
2. **02:15:00**: Storage Array logs: `Volume_01 IOPS Limit Exceeded`.
3. **02:15:00**: vCenter logs: `SCSI Latency High`.

There it was. A rogue "Test Backup Server" triggering a massive snapshot exactly one second before the alarm.

# The Fix

We disabled the rogue job. The haunts stopped immediately.

### Key Takeaway

**Logs are just noise until you correlate them across time.**

Siloed logs tell half the story. You need a centralized brain to see the sequence of events.
