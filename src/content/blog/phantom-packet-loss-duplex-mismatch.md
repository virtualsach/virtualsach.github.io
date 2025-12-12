---
title: "The Phantom Packet Loss: Why I Always Check Duplex Settings"
date: 2011-05-10
description: "A premium customer had slow speeds and 2% packet loss. We swapped routers, fibers, and prayers. Nothing worked. The culprit? A hidden duplex mismatch."
draft: false
tags: ["cisco", "troubleshooting", "layer1", "spectranet", "networking"]
---

It was May 2011. I was a Field Engineer at Spectranet, running around Delhi fixing radio links.

A premium enterprise customer called in screaming about slow speeds. "We are paying for 10Mbps, but files are crawling! And Ping is dropping!"

## The Mystery

I pinged their router. **2% packet loss.** Consistently.
The bandwidth utilization was low. The CPU was idle.
We did the standard dance:

1. Swapped the CPE Router. (No fix)
2. Swapped the fiber patch cord. (No fix)
3. Cleaned the fiber optic connector. (No fix)

I was about to blame "Sunspots" when I decided to look deeper.

## The Discovery: Interface Counters

I logged into our Cisco CPE and ran `show interface FastEthernet0/1`.
Most people just look at "Up/Up". I looked at the error counters.

```bash
Router# show interface FastEthernet0/1
FastEthernet0/1 is up, line protocol is up 
  Hardware is Gt96k FE, address is 0011.2233.4455 (bia 0011.2233.4455)
  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec, 
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Full-duplex, 100Mb/s, 100BaseTX/FX
  ...
     129384 input errors, 9832 CRC, 0 frame, 0 overrun, 0 ignored
     0 watchdog, 0 multicast, 0 pause input
     0 output errors, 4832 collisions, 12 interface resets
     2394 late collision, 0 deferred
```

**9832 CRC Errors. 2394 Late Collisions.**

## The Root Cause: Duplex Mismatch

A **Late Collision** is the smoking gun of a Duplex Mismatch.

* **Customer Side:** Their Firewall was hardcoded to **100/Full**.
* **Our Side:** Our Router was set to **Auto/Auto**.

When one side is fixed and the other is Auto, the Auto side fails to detect duplex and defaults to **Half Duplex** (per the IEEE standard).
So we had:

* Customer: Full Duplex (I can send anytime!)
* Our Router: Half Duplex (I can only send if the line is quiet!)

The result? Collision domains colliding. Packets dying.

## The Fix

I entered the magic commands on our side:

```bash
interface FastEthernet0/1
 speed 100
 duplex full
```

The errors stopped incrementing instantly. The packet loss dropped to 0%.

## The Lesson

**Auto-negotiation fails more often than you think.**
Especially with older gear. Don't trust "Up/Up". Trust the counters. If you see CRCs or Collisions, check your Speed/Duplex.
