---
title: "Capacity Planning with Cacti: Predicting the Bandwidth Cliff"
date: 2013-02-15T09:00:00+05:30
draft: false
tags: ["Capacity Planning", "Networking", "Operations", "Cacti", "Career"]
summary: "In the pre-cloud era, a 1 Gbps link was exactly 1 Gbps. If traffic hit 1.1 Gbps, the network broke. Here is how I used Cacti trend lines to predict a bandwidth cliff and prevent a catastrophic outage."
---

In the modern era of public cloud, "capacity planning" often just means setting an auto-scaling policy and forgetting about it. If traffic spikes, the cloud provider simply spins up more instances.

But back at Net4, we lived in a different reality. We didn't have elastic compute or burstable bandwidth on demand. We had physical circuits with hard ceilings. A 1 Gbps link was exactly 1 Gbps. If traffic hit 1.1 Gbps, the network didn't scale; it broke. Packets dropped, latency skyrocketed, and customers went offline.

In that environment, capacity planning wasn't an administrative task; it was a survival mechanism.

## The Tool: Cacti and the SNMP Heartbeat

We relied on **Cacti**, a frontend for RRDTool (Round Robin Database Tool). It was the industry standard for a reason.

Every five minutes, Cacti would reach out to our border routers via SNMP (Simple Network Management Protocol) and ask a simple question: *"How many octets have passed through interface GigabitEthernet0/1?"*

It would plot these data points on a graph. To the untrained eye, these graphs just look like jagged mountains. To a network architect, they are a narrative of human behavior. You can see when the city wakes up, when the lunch rush hits, and when the backup jobs kick off at night.

## The Analysis: Beyond the Average

The mistake most junior engineers make is looking at the "Average" utilization.

Averages are comfortable liars. If a link is idle for 12 hours and 100% saturated for 12 hours, the average is 50%. The dashboard says "Green," but your customers are screaming for half the day.

My strategy focused on the **95th Percentile**.

This metric discards the top 5% of data points (bursts) to ignore anomalies, giving you the "sustained peak" utilization—the bandwidth you are actually paying for and using.

But I went deeper. I wasn't just checking if we were red today. I was calculating the *slope*.

## The Bandwidth Cliff

One spring, I was auditing our primary transit link usage over a 3-month period.

On a daily basis, things looked fine. We were peaking at about 70% utilization. Plenty of headroom, right? Most teams would have closed the ticket and moved on.

But when I zoomed out to the quarterly view, I saw the trend line. Our traffic wasn't flat; it was growing at a consistent rate of 5% week-over-week.

It was a slow creep, invisible in the daily noise. But simple math revealed the danger. Compounding that 5% growth meant that our "safe" 70% utilization would hit 100% saturation in exactly six weeks.

I looked at the calendar. My projection showed we would hit the "**Bandwidth Cliff**"—total saturation—by July 1st.

## The Silent Win

I took the data to management. I showed them the graph, the slope, and the math.

"We are not out of bandwidth today," I explained. "But we will be out of bandwidth on July 1st. And provisioning a new carrier circuit takes 4 weeks. We need to sign the PO today."

We upgraded the circuit two weeks before the predicted deadline.

On July 1st, traffic surged exactly as predicted. It crossed the old 1 Gbps limit without a stutter, flowing smoothly into the new capacity. No packets dropped. No alarms triggered. No customers called.

## The Lesson

In Operations, silence is the only true applause.

If you are fighting fires, you are already losing. The upgrade was a non-event, and that is exactly the point.

The lesson I carried forward is this: **"Real capacity planning isn't looking at a dashboard to see where you are today. It's looking at the dashboard to see where you will be next month."**

The difference between a stable network and a catastrophic outage is often just a spreadsheet and the foresight to trust the trend line.
