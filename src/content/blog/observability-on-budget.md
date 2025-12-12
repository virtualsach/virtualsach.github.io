---
title: "Observability on a Budget: RANCID + Observium"
date: 2012-11-05T09:00:00+05:30
draft: false
tags: ["Networking", "Observability", "Open Source", "NOC", "Career"]
summary: "We built our own Network Operations Center (NOC) stack with RANCID and Observium. It wasn’t pretty, but it was bulletproof. Here is how we achieved total network observability for $0."
---

> "Management expected 99.999% uptime but gave us $0 budget for tooling. We didn't have SolarWinds. We had Linux and necessity."

We built our own NOC stack for the cost of a used server and coffee.

# 1. The Safety Net: RANCID

If you manage a network without automated backups, you are gambling.

We deployed **RANCID**. Every hour, it diffed the running config against **CVS/SVN**.
**The Save**: A junior engineer accidentally `write erase`'d a distribution router. I restored the config from 59 minutes ago. Downtime: 10 mins.

---

# 2. The Eyes: Observium & Cacti

* **Cacti**: Historical graphing. Usage trends over 6 months.
* **Observium**: The "Single Pane of Glass." Auto-discovery of devices via SNMP.

# 3. The Truth: Centralized rsyslog

SSH-ing into 50 routers to `grep` logs is impossible during an outage.
We spun up a central **rsyslog** server. We could see failed logins and OSPF flaps across the entire fleet in real-time.

### Key Takeaway

**You don't need Splunk to know your network. You need discipline.**

Money buys dashboards, but it doesn't buy understanding. Building the stack yourself forces you to learn exactly how SNMP and Syslog work. That knowledge is priceless.
