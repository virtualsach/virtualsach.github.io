---
title: "When Kubernetes Met NSX-T: Bridging the Dev vs. Ops Gap"
date: 2021-05-12
description: "Developers wanted speed. Ops wanted control. The clash was inevitable. Here is how we used the NSX Container Plugin (NCP) to make everyone happy."
draft: false
tags: ["kubernetes", "nsx-t", "ncp", "cni", "devops", "ntt-data"]
---

It was May 2021. The "Cloud Native" wave had hit our client.

**The Clash:**

* **Developers**: "We need to spin up 50 namespaces today for testing. We can't file a ticket for every subnet."
* **Network Ops**: "We can't just let you create rogue networks. We need IPAM, we need Firewall rules, and we need compliance."

It was the classic Speed vs. Control deadlock.

## The Solution: NSX Container Plugin (NCP)

We implemented the **NSX Container Plugin (NCP)**.

To the Developer, it looked like standard Kubernetes. To the Network Engineer, it looked like standard NSX-T.

## The Tech: The Role of CNI

At the heart of this was the **Container Network Interface (CNI)**.

Kubernetes doesn't actually know how to do networking; it outsources that to a CNI plugin. We replaced the default `flannel` or `calico` CNI with the NSX CNI.

**Here is the magic flow:**

1. Dev runs `kubectl create namespace app-test`.
2. The **NCP**, running as a Pod, listens to the K8s API Server. "Oh, a new namespace?"
3. NCP talks to the **NSX Manager API**.
4. NSX Manager automatically creates a new **Logical Switch (Segment)** and a **Tier-1 Gateway** just for that namespace.
5. It allocates a `/24` subnet from the central IPAM block.

## The Impact

The Developers got their self-service. They ran `kubectl`, and the network appeared.
The Ops team got their control. Every time a new Namespace appeared, it automatically inherited the "Global Default Firewall Policy" from NSX.

## The Lesson

**Don't fight the platform. Integrate with it.**
If you try to wrap legacy ITIL ticketing processes around Kubernetes, you will fail. You have to build the guardrails into the platform itself.
