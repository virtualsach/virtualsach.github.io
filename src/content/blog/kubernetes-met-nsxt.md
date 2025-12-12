---
title: "When Kubernetes Met NSX-T: Bridging the Dev vs. Ops Gap"
date: 2021-05-12
description: "Developers wanted speed. Ops wanted control. The clash was inevitable. Here is how we used the NSX Container Plugin (NCP) to make everyone happy."
draft: false
tags: ["kubernetes", "nsx-t", "ncp", "cni", "devops", "ntt-data"]
---

> "Developers wanted to spin up 50 namespaces today. Network Ops wanted IPAM, Firewalls, and Compliance. It was the classic Speed vs. Control deadlock."

It was May 2021. The "Cloud Native" wave had hit our client.

# The Clash

* **Developers**: "We need to spin up 50 namespaces today for testing."
* **Network Ops**: "We can't just let you create rogue networks."

---

# The Solution: NSX Container Plugin (NCP)

We implemented the **NSX Container Plugin (NCP)**.

To the Developer, it looked like standard Kubernetes. To the Network Engineer, it looked like standard NSX-T.

## The Tech: The Role of CNI

At the heart of this was the **Container Network Interface (CNI)**.

Kubernetes doesn't actually know how to do networking; it outsources that to a plugin. We replaced the default `flannel` or `calico` CNI with the NSX CNI.

**Here is the magic flow:**

1. Dev runs `kubectl create namespace app-test`.
2. The **NCP** listens to the K8s API Server.
3. NCP talks to the **NSX Manager API**.
4. NSX Manager automatically creates a **Tier-1 Gateway** and **Logical Segment**.
5. It allocates a `/24` subnet from the central IPAM block.

# The Impact

The Developers got their self-service. They ran `kubectl`, and the network appeared.

The Ops team got their control. Every new Namespace automatically inherited the "Global Default Firewall Policy" from NSX.

### Key Takeaway

**Don't fight the platform. Integrate with it.**

If you try to wrap legacy ITIL ticketing processes around Kubernetes, you will fail. You have to build the guardrails into the platform itself.
