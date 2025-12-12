---
title: "The Death of Cisco ACE: Migrating to F5 LTM"
date: 2014-02-14
description: "When Cisco killed the ACE load balancer, I had to migrate a critical banking app to F5. Here's how we mapped contexts to partitions and rewrote Tcl to iRules."
draft: false
tags: ["cisco", "f5", "load-balancing", "migration", "wipro", "scripting"]
---

> "For many of us who had cut our teeth on the Catalyst 6500 service modules, existing the ACE era was the end of a chapter. But for our client—a major bank—it was a crisis."

It was 2014, and I was a **Technical Lead** at Wipro. Cisco had announced the end-of-life for their **Application Control Engine (ACE)** load balancers.

We had a critical banking application running on ACE modules that needed to be migrated to **F5 LTMs** immediately. The traffic couldn't stop, and the logic was complex.

---

# The Concept Map

The first mental hurdle was mapping the virtualization concepts.

In **Cisco ACE**, we used **Contexts** to virtualize the hardware. You could slice a single physical ACE module into multiple virtual load balancers.

On the **F5** side, the equivalent wasn't just "Administrative Partitions." We needed strict network isolation.

* **Cisco ACE Context**: Virtualizes resources + network separation.
* **F5 Partition**: Administrative separation (RBAC).
* **F5 Route Domain**: Strict network isolation (overlapping IPs).

We designed the F5 architecture using **Route Domains (ID %10, %20)** to match the strict isolation required for the DMZ and Internal zones.

# The Scripting: Tcl to iRules

The banking app relied heavily on **Layer 7 manipulation**.

On ACE, this was done using **Tcl scripts** embedded in the policy maps. F5 uses **iRules** (also Tcl-based, but with distinct syntax).

We had to port this logic: *If the URI starts with `/finance`, send to the secure pool. If the user-agent is mobile, redirect to `m.bank.com`.*

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

# The Pain: SSL Offloading

The biggest headache was **SSL Offloading**.

* **ACE:** One config block handled everything.
* **F5:** We needed a **ClientSSL** profile (decrypt client side) AND a **ServerSSL** profile (re-encrypt to server).

We spent two nights debugging a "Connection Reset" error. It turned out the backend servers were rejecting the F5's cipher suite. We had to tune the **ServerSSL profile** to match the legacy ciphers supported by the backend Mainframes.

### Key Takeaway

The migration succeeded. The F5s offered way more visibility than the ACEs ever did.

But I still miss the raw CLI speed of the Cisco ACE. It was specialized hardware for a specialized job. The F5 was a Swiss Army knife.
