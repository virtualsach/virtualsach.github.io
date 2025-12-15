---
title: "From CLI to Code: Why I Spent 100 Hours Re-Learning Infrastructure"
date: 2023-12-15
description: "After 15 years of mastering the CLI, I went back to the labs to master Terraform and Kubernetes."
tags: ["DevOps", "Terraform", "Kubernetes", "Leadership"]
---

> "The CLI is for configuration. Code is for architecture. To lead the latter, you must understand the former."

For 15 years, my hands were glued to the keyboard, typing `show ip route` or configuring **NSX-T** via the manager UI. I could troubleshoot a BGP adjacency in my sleep.

But in 2023, I realized something uncomfortable. The teams I was leading weren't using the CLI. They were using **Terraform** and **Kubernetes**. I was designing systems I could no longer configure "by hand."

So, I went back to school.

---

### The Reality Check

I realized that "GUI-driving" architects eventually become bottlenecks.

If I couldn't read a `main.tf` file or debug a **Kubernetes** manifest, I wasn't an Architect—I was just a diagram drawer. To bridge the gap between "Infrastructure" and "Application," I needed to speak the native language of my developers: **Code**.

### The 100-Hour Grind

I dedicated my weekends to re-learning the stack from the bottom up.

* **Infrastructure as Code:** I didn't just read the docs; I built pipelines. I learned the hard way why **State Locking** in Terraform is critical when two people deploy at once.
* **Containerization:** I moved from "understanding Docker" to building multi-container apps. I debugged **CrashLoopBackOff** errors until I understood the difference between a Pod and a Deployment.
* **Automation:** I refreshed my **Python** skills, writing scripts to validate network states automatically instead of manually checking logs.

### The Return on Investment

This wasn't about becoming a developer. It was about becoming a better leader.

Now, when a DevOps engineer tells me "the pipeline is failing because of a state mismatch," I don't stare blankly. I ask, "Did we check the **Lease Blob** in the Azure Storage Account?"

### Key Takeaway

**Empathy requires understanding.**

You don't need to write production code every day to be a Principal Architect. But you must respect the complexity of the tools your team uses. The best way to respect them is to learn them.
