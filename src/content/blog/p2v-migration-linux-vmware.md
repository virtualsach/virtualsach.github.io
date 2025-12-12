---
title: "P2V Nightmares: Migrating Physical Linux Boxes to VMware ESXi"
date: 2013-06-20T09:00:00+05:30
draft: false
tags: ["Virtualization", "Linux", "VMware", "P2V", "Troubleshooting"]
summary: "The promise of P2V (Physical-to-Virtual) was seamless. But when I tried to virtualize our Billing Server, I ended up with a Kernel Panic."
---

> "I watched the progress bar. 90%... 98%... It stood there for an eternity before spitting out a generic 'Failed' error."

If you worked in IT infrastructure during the "Virtualization Boom," you remember the promise of **P2V (Physical-to-Virtual)**.

The brochures made it sound seamless. Point the **vCenter Converter** at your dusty physical server, click "Next," and 30 minutes later, it’s a VM.

Then there was the reality: **The Billing Server**.

---

# The Patient

This server was the heartbeat of our revenue. It ran an ancient version of **Red Hat Enterprise Linux (RHEL)** with a custom-compiled kernel.

Nobody wanted to touch it. But we *had* to move it to our new IaaS cloud.

# The 98% Heartbreak

I fired up the internal converter. The data copy finished, technically.

But when I tried to power on the VM, I didn't get a login prompt. I got the **Screen of Death**:

`Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)`

The VM was brain-dead.

# The Root Cause

After hours of troubleshooting, I realized it was a **driver mismatch**.

* **Physical Life:** The server used a hardware RAID controller (Dell PERC) with the `megaraid` driver.
* **Virtual Life:** I assigned it a standard **LSI Logic Parallel** adapter.

When the VM booted, the kernel looked for the physical RAID card and found nothing. It didn't have the `mptspi` drivers needed to talk to the virtual SCSI controller.

# The Fix: Linux Surgery

There is no GUI for this fix. I had to perform open-heart surgery on the OS.

1. **The Rescue**: Booted into RHEL Rescue Mode.
2. **The Mount**: Manually mounted the partitions to `/mnt/sysimage`.
3. **The Chroot**: `chroot /mnt/sysimage` (Making the OS think the rescue environment was the real server).

I needed to force the kernel to load the VMware-compatible SCSI drivers. I navigated to the boot directory and rebuilt the **initrd**:

```bash
mkinitrd -v -f --with=mptspi /boot/initrd-2.6.xx-custom.img 2.6.xx-custom
```

I watched the output scroll: `Adding module mptspi...`. I typed `reboot` and held my breath.

### The Answer

The VMware BIOS flashed. The kernel unpacked.

`Welcome to Red Hat Enterprise Linux`

### Key Takeaway

We like to think of Virtualization as a magic abstraction layer. But if your OS doesn't know how to speak to the emulated hardware, you're dead in the water.

Sometimes, to move to the cloud, you have to dig deep into the modules.
