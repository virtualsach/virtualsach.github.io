---
title: "From CLI to Code: Why I Spent 100 Hours Re-Learning Infrastructure in 2023"
date: 2023-12-15T09:00:00+05:30
description: "After 15 years of mastering the CLI, I realized the future was Declarative. I didn't just 'manage' the team; I went back to the labs."
summary: "You don't need to write production code every day, but you must understand the pain of those who do."
tags: ["DevOps", "Terraform", "Kubernetes", "Career", "Leadership", "IaC"]
role: "Associate Director"
---

> "The scariest moment for a Senior Architect is realizing that the CLI commands you memorized for 15 years are now considered 'Technical Debt'."

---

## The Realization

It was 2022. I was leading a team of cloud engineers. I could design a global BGP architecture on a napkin. I could debug a spanning-tree loop in my sleep.

But when my team started talking about **Terraform State Locking** and **Kubernetes Ingress Controllers**, I felt a chill.

I wasn't just losing touch; I was becoming a "Visio Architect"—someone who draws pretty boxes but doesn't understand the glue that holds them together.

I had two choices:

1. Hide behind my title and delegate everything.
2. Go back to the beginning.

I chose the grinding path.

## The Grind

In 2023, I committed to **100+ hours** of hands-on labs. No delegation. No "consultants." Just me, VS Code, and a lot of red error messages.

### 1. Terraform: The New CLI

I used to type `conf t`. Now I type `terraform plan`.

The shift from **Imperative** (do this, then do that) to **Declarative** (make it look like this) was a mental rewire.

* **The Pain:** Managing state files is harder than managing VLANs.
* **The Gain:** Assessing the impact of a change *before* it breaks production is a superpower I wish I had in 2010.

### 2. Kubernetes: The New Operating System

I spent weekends wrestling with YAML manifests.

* Understanding that a **Pod** is ephemeral was easy.
* Understanding **Networking** in K8s (CNI, Services, Ingress) was where my network background paid off. I realized that under the hood, it's still IP routing—just abstracted by fifteen layers of software.

## The Outcome

I don't write production code every day. That's not my job. My job is to see the big picture.

But because I spent those 100 hours in the trenches:

1. **I Design Better Systems:** I don't ask for "Active/Active" without asking about state persistence.
2. **I Estimate Better:** I know that "just add a load balancer" is actually 50 lines of Terraform and a DNS cutover.
3. **I Earn Respect:** When I sit in a code review, I'm not just a manager nodding along. I'm an engineer who knows what `CrashLoopBackOff` feels like.

### Key Takeaway

**You don't need to be the best coder in the room.** But you must understand the pain of those who are.

The best Architects aren't the ones who know all the answers. They are the ones who know how the machine actually works.
