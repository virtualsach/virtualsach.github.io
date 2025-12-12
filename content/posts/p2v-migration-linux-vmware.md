---
title: "P2V Nightmares: Migrating Physical Linux Boxes to VMware ESXi"
date: 2013-06-20T09:00:00+05:30
draft: false
tags: ["Virtualization", "Linux", "VMware", "P2V", "Troubleshooting"]
summary: "The promise of P2V (Physical-to-Virtual) was seamless migration. But when I tried to virtualize our Billing Server, I ended up with a Kernel Panic and had to perform open-heart surgery on the OS."
---

If you worked in IT infrastructure during the great "Virtualization Boom," you remember the promise of **P2V (Physical-to-Virtual)**.

The brochures made it sound seamless. You install the VMware vCenter Converter Standalone, point it at your dusty, loud, heat-generating physical server, click "Next," and 30 minutes later, it’s a beautiful, clean VM running on your shiny new vSphere cluster.

That was the dream.

Then there was the reality I faced at Net4 India: **The Billing Server**.

## The Patient

This server was the heartbeat of our revenue. It was running an ancient version of Red Hat Enterprise Linux (RHEL), ticking away on a custom-compiled kernel that probably hadn't been patched since the Bush administration. Nobody wanted to touch it. But we had to move it to our new IaaS cloud.

## The 98% Heartbreak

I fired up the vCenter Converter. I configured the source and destination. I started the job.

I watched the progress bar. 10%... 50%... 90%...

At **98%**, the tool stalled. It sat there for an eternity, taunting me, before spitting out a generic "Failed" error.

Technically, the data copy was done. The disk blocks were there. But when I tried to power on the VM, I didn't get a login prompt. I got the screen of death—white text on a black background:

`Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)`

The VM was brain-dead.

## The Root Cause: Lost in Translation

After hours of troubleshooting, I realized what had happened. It was a driver mismatch.

In its physical life, this server used a hardware RAID controller (likely a Dell PERC or HP SmartArray) which used the `megaraid` driver. The kernel was compiled specifically to look for that hardware at boot.

But in its new virtual life on ESXi, I had assigned it a standard **LSI Logic Parallel** adapter.

When the VM booted, the kernel looked for the physical RAID card. It found... nothing. It didn't have the drivers (`mptspi`) to talk to the virtual SCSI controller. It couldn't see its own hard drive, so it couldn't mount the root filesystem. It panicked.

Because the kernel was custom-compiled, the standard VMware Converter injection scripts couldn't crack it open to insert the new drivers automatically.

## The Fix: Linux Surgery

There is no GUI for this fix. I had to perform open-heart surgery on the OS.

1. **The Rescue**: I mounted a standard RHEL ISO to the VM and booted into Rescue Mode.
2. **The Mount**: I searched for the VM's partitions and mounted them manually to `/mnt/sysimage`.
3. **The Chroot**: This is where you feel like a hacker. I changed the root directory to make the OS think the rescue environment was the real server: `chroot /mnt/sysimage`

Now I was inside the belly of the beast. I verified the kernel version and checked the `modprobe.conf`. I needed to force the kernel to load the VMware-compatible SCSI drivers.

I navigated to the boot directory and ran the command that saved my job. I manually rebuilt the initial RAM disk (initrd), forcing it to preload the LSI Logic drivers:

```bash
mkinitrd -v -f --with=mptspi /boot/initrd-2.6.xx-custom.img 2.6.xx-custom
```

I watched the verbose output scroll by. `Adding module mptbase... Adding module mptspi... Filesystem modules added...`

I typed `reboot` and held my breath.

## The Triumph

The VMware BIOS flashed. The GRUB loader appeared. The kernel unpacked.

And then, instead of the panic message, I saw the most beautiful words in the English language:

`Welcome to Red Hat Enterprise Linux`
`localhost login: _`

## The Lesson

We like to think of Virtualization as a magic abstraction layer that hides the hardware. And 99% of the time, it is.

But that day, I learned that Virtualization is magic, until you run into a custom kernel. Then, it's just Linux plumbing.

The hypervisor can emulate all the hardware it wants, but if your OS doesn't know how to speak to it, you're dead in the water. Sometimes, to move to the cloud, you have to dig deep into the modules.
