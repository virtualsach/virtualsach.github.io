---
title: "The Zero Trust Lie: Implementing Distributed Firewall (DFW) in Brownfield"
date: 2017-11-15
description: "A banking client wanted 'Zero Trust' on a flat VLAN with 500 VMs. Turning on 'Block All' would have been a disaster. Here is how we used vRNI and Monitor Mode to survive."
draft: false
tags: ["nsx", "security", "zero-trust", "micro-segmentation", "vrni", "ibm"]
---

It was November 2017. "Zero Trust" was the buzzword of the year. A banking client came to us with a mandate: *Implement Zero Trust micro-segmentation on our primary VLAN.*

The Reality: It was a generic flat VLAN with 500 VMs—Web, App, DB, and Active Directory—all talking to each other indiscriminately.

If we had implemented "Zero Trust" (i.e., Default Deny) on Day 1, we would have fired the entire company.

## The Solution: The "Allow" Phase

You cannot secure what you do not understand. We deployed **vRealize Network Insight (vRNI)** and let it run for 30 days. It mapped every flow (TCP/UDP) between every VM.

We found dependencies nobody knew about. The "Legacy Reporting Server" was actually scraping the "Production Database" every hour via Telnet.

## The Grouping: Tags over IPs

In the physical world, we grouped by Subnet. In NSX, we grouped by **Tag**.
We tagged VMs as `Web`, `App`, `DB`. This allowed us to write policy that followed the VM, regardless of its IP.

## The Implementation: Monitor Mode

We didn't just turn on the firewall. We pushed the rules in **Monitor Mode** (Log Only).
We let it run for another week. We checked the logs for "Matches" on our Allow rules and "Matches" on the Default Block rule.

Once the Default Block logs went silent (meaning we had captured all legitimate traffic in Allow rules), only *then* did we change the Action to `Reject`.

## The Code: DFW Rule Definition

NSX is driven by API. Here is what a micro-segmentation rule looks like in JSON. We defined these programmatically:

```json
{
  "sectionId": "1001",
  "name": "Banking_App_Isolation",
  "rules": [
    {
      "name": "Allow_Web_to_App",
      "action": "ALLOW",
      "sources": [
        { "type": "SecurityGroup", "value": "sg-web-tier" }
      ],
      "destinations": [
        { "type": "SecurityGroup", "value": "sg-app-tier" }
      ],
      "services": [
        { "protocol": "TCP", "port": "443" }
      ]
    }
  ]
}
```

## The Lesson

**Micro-segmentation isn't a firewall project; it's an application mapping project.**

The hard part isn't blocking traffic. The hard part is knowing what to allow. If you skip the discovery phase, your "Zero Trust" project will quickly become a "Zero Availability" event.
