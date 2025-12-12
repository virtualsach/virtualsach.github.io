---
title: "Debugging the Air: Troubleshooting Packet Loss on WiMAX & RF Links"
date: 2011-09-15T09:00:00+05:30
draft: false
tags: ["Networking", "Wireless", "Troubleshooting", "Field Engineering", "Career"]
summary: "For thousands of customers, 'The Cloud' is a focused beam of radio waves. I learned that you can't route-map your way around a building crane."
---

In the corporate world, "The Cloud" is a clean, white icon on a PowerPoint slide. It suggests that data floats effortlessly from a server to your laptop.

But I was a Field Engineer at Spectranet. I knew the dirty truth.

For thousands of enterprise customers, "The Cloud" isn't magic. It is a focused beam of radio waves blasting through the smog, dodging pigeons, and fighting the laws of physics to hit a receiver dish on a rooftop five kilometers away.

When you work with WiMAX and RF (Radio Frequency), you aren't just a network engineer. You are a weather forecaster, a structural engineer, and occasionally, a steeplejack.

## The 4:00 PM Mystery

I once had a ticket that haunted me for a week. A high-priority enterprise customer was reporting crippling packet loss.

The symptoms were maddeningly specific: The link was rock solid all morning. Perfect throughput, low jitter. But exactly at 4:00 PM, like clockwork, the connection would choke. Dropped packets, latency spikes, and angry phone calls. By 5:30 PM, it would clear up.

## The Debug: CLI vs. Reality

I did what every engineer does first. I blamed the router.

I logged into the edge device. I checked the CPU utilization. I checked the buffer settings. I scoured the logs for interface flapping or duplex mismatches.

* **Config**: Clean.
* **BGP Peers**: Stable.
* **Errors**: None on the copper side.

From the safety of the NOC, everything looked perfect. But the customer was screaming.

So, I grabbed my tool bag, put on my safety harness, and went to the site.

## The Climb

There is no air conditioning at Layer 1. I climbed the ladder to the customer's roof under the brutal afternoon sun.

I hooked up my spectrum analyzer and signal meter to the IDU (Indoor Unit) and traced the cable to the ODU (Outdoor Unit) mounted on the mast.

I looked at the **RSSI** (Received Signal Strength Indicator). It was fluctuating wildly. One second I had a solid `-65 dBm`, the next it dropped to `-85 dBm` (basically silence).

I squinted across the skyline, following the invisible line of the Fresnel Zone toward our base station tower miles away.

And then I saw it.

It wasn't "Rain Fade"—the classic enemy of RF where heavy downpours absorb the signal. It wasn't a config error. **It was a crane.**

A new high-rise was going up three blocks away. Every day around 4:00 PM, the construction crew swung the crane arm into a specific position to unload materials for the end of the shift. That giant arm of steel was swinging right through my Line of Sight (LoS), scattering my radio waves like a shotgun blast.

## The Fix: Wrench and muscle

You can't fix a crane with Python code. You can't route-map your way around a building.

The fix was physical. I had to unbolt the mast clamp, sweat dripping into my eyes, and physically manhandle the antenna. I re-aligned the azimuth and elevation, searching for a new signal lobe that bypassed the obstruction.

I spent an hour up there, watching the signal meter while making millimeter adjustments.

* Tweak left. Signal drops.
* Tweak up. Signal drops.
* Tweak right. **Boom. -58 dBm.**

I locked down the bolts, waterproofed the connectors with fresh tape, and watched the packet loss counter hit zero.

## The Lesson

We live in an era of Software-Defined Networking (SDN) and automated orchestration. We like to think we can control the world from a keyboard.

But that day on the roof taught me the most important rule of networking: **Always check Layer 1 first.**

You can have the most sophisticated BGP policies in the world, but if a crane blocks your RF beam, or water gets into your connector, or a billboard goes up in your path, you are offline.

You cannot code your way out of bad physics. Sometimes, you just need a wrench.
