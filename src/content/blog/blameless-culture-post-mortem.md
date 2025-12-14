---
title: "The 'Blameless' Post-Mortem: Fixing Culture, Not Just Code"
pubDate: 2022-10-12
description: "Fear kills observability. If engineers are scared to admit mistakes, you will never find the root cause."
author: "Virtual Sachin"
tags: ["Leadership", "Culture", "SRE", "Management"]
---

> "Fear kills observability. If engineers are scared to admit mistakes, you will never find the root cause."

## The Scenario

**Date:** October 12, 2022  
**Context:** Transition / Team Leadership Era (NTT Data)

A critical production service went down for 4 hours. The outage cost the client significant revenue and reputational damage. The cause? A senior engineer had manually applied a configuration change that conflicted with an existing policy, causing a cascading failure in the routing mesh.

The following morning, I walked into the "War Room" for the Post-Incident Review (PIR). The atmosphere was suffocating. The engineer responsible sat in the corner, pale and silent. The team was waiting for the axe to fall. They were waiting to see *who* would be fired.

## The Reality Check

In that moment, I realized our culture was a bigger risk than our code. If engineers are terrified of consequences, they will hide their mistakes. They will delay reporting incidents. They will not document the "near misses."

**You cannot build a resilient system on a foundation of fear.**

## The Solution

I opened the meeting not by asking "Who did this?", but by writing on the whiteboard: **"How did the system allow this to happen?"**

I started the review by highlighting my own failure: "I failed to ensure we had a linting check in the pipeline that would have caught this syntax error before it reached production."

By shifting the focus from the *individual* to the *process*, the tension in the room evaporated. The conversation shifted from defense to problem-solving.

We identified that the engineer didn't have a safe way to test the change locally.
**The Fix:**

1. implemented a pre-commit hook (automated linting).
2. Created an ephemeral sandbox environment for testing routing changes.

The engineer wasn't fired. In fact, they led the implementation of the new testing framework.

### Key Takeaway

**A 'Blameless' Post-Mortem is not about avoiding accountability; it's about strategic accountability.** We hold people accountable for following the process, but we hold the *process* accountable for failure. If a human can bring down production with a typo, the error lies with the system, not the human.
