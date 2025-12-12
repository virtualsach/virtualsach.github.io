---
title: "The Magic of HCX: Moving 500 VMs Without Re-IPing"
date: 2019-01-15
description: "A client had 30 days to exit their data center. Re-IPing provided to be impossible. Enter VMware HCX: How we stretched L2 to the cloud and moved 500 VMs with zero downtime."
draft: false
tags: ["vmware", "hcx", "migration", "cloud", "ibm", "softlayer"]
---

It was January 2019. I was working on a massive data center exit for a client moving to the IBM Cloud (SoftLayer). The deadline was immovable: The lease on their physical data center expired in 30 days.

The problem? Applications. Hundreds of them. Hardcoded IP addresses, legacy licensing servers tied to MAC addresses, and a complete lack of documentation. Re-IPing the 500 VMs would take 6 months. We had 4 weeks.

## The Solution: VMware HCX

We deployed **VMware HCX (Hybrid Cloud Extension)**. It was relatively new technology at the time, promising to bridge the gap between legacy vSphere environments and modern clouds.

## The Tech: L2 Extension

The first piece of magic was the **Network Extension**. We deployed an HCX appliance on-prem and another in the IBM Cloud. They built a secure tunnel and effectively "stretched" the on-prem VLANs across the internet.

Suddenly, a VM in Dallas (On-Prem) and a VM in Washington DC (Cloud) were on the exact same Layer 2 network. No routing changes. No Re-IPing.

## The Migration Methods

We had to choose how to move the data. HCX offered a few flavors, and understanding the difference was critical.

### Cold Migration

This is the "shut down and move" approach. It copies the data while the VM is off. It's safe, but it requires downtime. We used this for dev/test boxes that nobody cared about.

### Replication Assisted vMotion (RAV)

This was the game changer for Production.

1. **Replication Phase**: HCX copies the data (allocated storage) to the cloud while the VM is running. The user sees nothing.
2. **Delta Sync**: It keeps syncing changes.
3. **Switchover**: During the maintenance window, it pauses the VM, sends the last memory state (vMotion), and resumes it in the cloud.

RAV allowed us to migrate massive 2TB+ databases with only seconds of "stun" time.

## The 'Aha' Moment

I remember the night we moved the critical "Core Banking" app. I had a continuous ping running to the server's IP.

`Reply from 10.10.10.50: bytes=32 time=2ms`
`Reply from 10.10.10.50: bytes=32 time=2ms`
*(Migration Switchover Triggered)*
`Request timed out.`
`Reply from 10.10.10.50: bytes=32 time=45ms`

That jump in latency (2ms to 45ms) was the only proof that the server had physically traveled 500 miles. The application didn't crash. The users didn't notice.

## The Lesson

**Migration isn't about moving data; it's about preserving identity.** If you can keep the IP and MAC address, you can move mountains (or data centers) without anyone noticing.
