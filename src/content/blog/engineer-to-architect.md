---
title: "From Engineer to Architect: The Mindset Shift"
date: 2021-12-15
description: "I was mentoring a brilliant Senior Engineer who was stuck. He knew every command in the CLI, but he couldn't get promoted. Here is the advice that changed his career."
draft: false
tags: ["career", "leadership", "architecture", "mentoring", "soft-skills", "ntt-data"]
---

> "Dave was the best troubleshooter I had. If a BGP neighbor went down at 3 AM, he was the guy. But he couldn't bridge the gap to 'Architect'."

It was December 2021. I was leading a team of Systems Integrators.

One of them—let's call him Dave—was stuck. He knew every flag in the **NSX-T CLI**. However, he kept failing the interview loop for the Principal role.

---

# The Gap: How vs. Why

I sat him down for a mentorship session.
"Dave," I said, "You are obsessed with the **How**."

* *How do I configure OSPF?*
* *How do I patch this vulnerability?*

"An **Architect**," I told him, "is obsessed with the **Why**."

* *Why are we using OSPF instead of BGP?*
* *Why does this vulnerability matter to the business?*

# The Advice: "It Depends"

I gave him a challenge. "For the next week, stop answering technical questions with commands. Start answering them with **'It depends...'** and then explain the trade-offs."

If someone asks, "Should we use VXLAN or VLANs?", don't say "VXLAN." Say:

> "It depends. Do we need Layer 2 extension across L3 boundaries? If yes, VXLAN. If we only have a single rack, VLANs are simpler."

# The Outcome

It took three months, but I saw the shift. Dave stopped reacting to tickets and started looking for patterns.

He got the promotion in Q2.

### Key Takeaway

**Engineering is about solving problems. Architecture is about choosing which problems are worth solving.**

If you want to move up, put down the CLI for a moment and look at the whiteboard. The code is important, but the context is everything.
