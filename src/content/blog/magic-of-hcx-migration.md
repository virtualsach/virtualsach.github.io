---
title: "The Magic of HCX: Moving 500 VMs Without Re-IPing"
date: 2019-01-15
description: "A client had 30 days to exit their data center. Re-IPing proved to be impossible. Enter VMware HCX: How we stretched L2 to the cloud and moved 500 VMs with zero downtime."
draft: false
tags: ["vmware", "hcx", "migration", "cloud", "ibm", "softlayer"]
---

> "Re-IPing 500 VMs would take 6 months. We had 4 weeks. The deadline was immovable."

It was January 2019. Massive data center exit.
Apps had hardcoded IPs and legacy licensing tied to MAC addresses.

# The Solution: VMware HCX

We deployed **HCX (Hybrid Cloud Extension)**.

## The Tech: L2 Extension

We built a secure tunnel that effectively "stretched" the on-prem VLANs to the IBM Cloud.
A VM in Dallas and a VM in Washington DC were on the **same Layer 2 network**.

---

# The Migration: Replication Assisted vMotion (RAV)

1. **Replicate**: Copy data while VM is running.
2. **Sync**: Keep delta syncing.
3. **Switchover**: Pause VM, send memory, resume in Cloud.

## The 'Aha' Moment

I moved the "Core Banking" app while pinging it.

```text
Reply from 10.10.10.50: time=2ms
Reply from 10.10.10.50: time=2ms
Request timed out.
Reply from 10.10.10.50: time=45ms
```

That jump in latency (2ms to 45ms) was the only proof the server had traveled 500 miles.

### Key Takeaway

**Migration isn't about moving data; it's about preserving identity.**

If you can keep the IP and MAC address, you can move mountains without anyone noticing.
