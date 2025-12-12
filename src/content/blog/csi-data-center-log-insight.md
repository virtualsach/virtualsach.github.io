---
title: "CSI Data Center: Forensic Analysis with vRealize Log Insight"
date: 2021-04-12
description: "Storage latency was spiking every night at 2:15 AM. The Storage Team blamed the Network. The Network Team blamed the Storage. I used vRLI to find the smoking gun."
draft: false
tags: ["vrli", "logging", "forensics", "troubleshooting", "vmware", "ntt-data"]
---

It was April 2021. We had a haunting in the Data Center.

Every night at exactly **02:15 AM**, the primary Storage Array would hit high latency (200ms+). This caused "VM Stuns," where Virtual Machines would freeze for a few seconds.

The Blame Game began:

* **Storage Team**: "The network is dropping packets."
* **Network Team**: "The switch ports are clean. The array controller is overwhelmed."

## The Investigation: vRealize Log Insight (vRLI)

I decided to stop guessing and start correlating. I pointed logs from **vCenter**, the **Storage Array**, and the **Backup Servers** to our centralized **vRealize Log Insight (vRLI)** instance.

## The Correlation using Interactive Analytics

vRLI has a powerful "Interactive Analytics" query builder. I didn't search for a specific error. I searched for **Time**.

I built a query to look at *all events* across *all devices* in the 5-minute window between **02:10 AM and 02:15 AM**.

**The Query Construction:**

1. **Time Range**: Custom (02:10 - 02:15)
2. **Group By**: `hostname`
3. **Visual**: Event Types over Time

## The Smoking Gun

The chart showed a spike of events. I drilled down.

* **02:14:59.500**: Backup Server `bkp-test-01` logs: `Job 'Full_VM_Backup' Started`.
* **02:15:00.100**: Storage Array logs: `Volume_01 IOPS Limit Exceeded`.
* **02:15:00.200**: vCenter logs: `SCSI Latency High on Datastore_01`.

There it was. A rogue "Test Backup Server" that someone had set up months ago and forgotten about. It was triggering a full snapshot backup exactly one second before the latency alarms went off.

## The Fix

We disabled the rogue job on `bkp-test-01`. The haunts stopped immediately.

## The Lesson

**Logs are just noise until you correlate them across time.**
Siloed logs (just checking the switch, just checking the array) tell half the story. You need a centralized brain to see the sequence of events.
