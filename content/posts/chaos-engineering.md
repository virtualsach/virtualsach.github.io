---
title: "Architecting for Failure: Chaos Engineering"
date: 2025-01-22
summary: "Hope is not a strategy. Breaking your own systems on purpose is."
tags: ["SRE", "Chaos Engineering", "Resilience"]
description: "Testing the unknown unknowns."
---

# Architecting for Failure

Everything fails, all the time. Hard drives die, networks get congested, and bad code gets deployed. If your architecture assumes a happy path, you are building a house of cards.

## The Principles of Chaos

Chaos Engineering isn't just "breaking stuff randomly". It's a disciplined approach to identifying weaknesses.

1. **Define Steady State**: What does "normal" look like? (e.g., Error rate < 1%).
2. **Hypothesize**: "If I kill the primary database node, the secondary will take over in < 30s."
3. **Inject Fault**: Actually kill the node.
4. **Verify**: Did it work? If not, fix it.

## Real World Example

At my last role, we assumed our Redis cache was optional. We thought, "If Redis dies, the app will just hit the DB."

We ran a Game Day where we flushed Redis. **Result**: The database melted down instantly under the load. The app wasn't resilient; it was dependent.

### The Fix

We implemented **Circuit Breakers** and **Graceful Degradation**. If Redis is down, we serve stale data or a default fallback, rather than hammering the DB.

## Conclusion

Don't wait for an outage to test your resilience. Schedule it.
