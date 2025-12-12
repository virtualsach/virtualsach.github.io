---
title: "The Death of Cisco ACE: Migrating to F5 LTM"
date: 2014-02-14
description: "When Cisco killed the ACE load balancer, I had to migrate a critical banking app to F5. Here's how we mapped contexts to partitions and rewrote Tcl to iRules."
draft: false
tags: ["cisco", "f5", "load-balancing", "migration", "wipro", "scripting"]
---

It was 2014, and I was a Technical Lead at Wipro. The writing was on the wall: Cisco had announced the end-of-life for their Application Control Engine (ACE) load balancers. For many of us who had cut our teeth on the Catalyst 6500 service modules, it was the end of an era. But for our client—a major bank—it was a crisis.

We had a critical banking application running on ACE modules that needed to be migrated to F5 LTMs immediately. The traffic couldn't stop, and the logic was complex.

## The Concept Map: ACE Contexts vs. F5 Route Domains

The first mental hurdle was mapping the virtualization concepts.

In Cisco ACE, we used **Contexts** to virtualize the hardware. You could slice a single physical ACE module into multiple virtual load balancers, each with its own VLANs and IP space.

On the F5 side, the equivalent wasn't just "Administrative Partitions" (which separate config), but **Route Domains**.

* **Cisco ACE Context**: Virtualizes resources + network separation.
* **F5 Partition**: Administrative separation (RBAC).
* **F5 Route Domain**: Strict network isolation (overlapping IPs).

We had to design the F5 architecture to use specific Route Domains (ID %10, %20) to match the strict isolation the bank required for their DMZ and Internal zones.

## The Scripting: Tcl to iRules

The banking app relied heavily on Layer 7 manipulation. On ACE, this was done using **Tcl scripts** embedded in the policy maps. F5 uses **iRules** (also Tcl-based, but with different syntax and events).

Here is the exact logic we had to port: *If the URI starts with `/finance`, send to the secure pool. If the user-agent is mobile, redirect to `m.bank.com`.*

### The Old Cisco ACE Script

```tcl
policy-map type loadbalance first-match L7_POLICY
  class class_finance
    serverfarm FARM_FINANCE
  class class_mobile
    redirect url http://m.bank.com
```

### The New F5 iRule

Converting this required understanding the event-driven nature of iRules.

```tcl
when HTTP_REQUEST {
    # Check for Mobile User Agent
    if { [string tolower [HTTP::header "User-Agent"]] contains "mobile" } {
        HTTP::redirect "http://m.bank.com[HTTP::uri]"
        return
    }

    # Path-based routing
    switch -glob [string tolower [HTTP::path]] {
        "/finance*" {
            pool pool_finance_secure
        }
        default {
            pool pool_general_web
        }
    }
}
```

The migration wasn't just a copy-paste; it was a translation of intent.

## The Pain: SSL Offloading

The biggest headache was **SSL Offloading**.

On Cisco ACE, the certificate management was... clunky. You imported the cert and key, assigned it to a proxy service, and that was it.

On F5, we had to deal with **ClientSSL** and **ServerSSL** profiles. The bank's backend servers required end-to-end encryption (Re-encryption).

* **ACE**: One config block handled it.
* **F5**: We needed a ClientSSL profile (decrypt client side) AND a ServerSSL profile (re-encrypt to server).

We spent two nights debugging a "Connection Reset" error, only to realize the backend servers were rejecting the F5's cipher suite. We had to tune the ServerSSL profile to match the legacy ciphers supported by the backend Mainframes.

## The Aftermath

The migration succeeded. The F5s offered way more visibility than the ACEs ever did. But I still miss the raw CLI speed of the Cisco ACE. It was specialized hardware for a specialized job. The F5 was a Swiss Army knife.

In the end, this project taught me that "Load Balancing" is dead; "Application Delivery" is the reality.
