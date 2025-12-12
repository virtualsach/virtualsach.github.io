---
title: "The VPN Nightmare: Migrating 5,000 Users to AnyConnect"
date: 2016-06-15
description: "We had to move 5,000 users from legacy IPSec to AnyConnect SSL VPN. Then we hit 'Certificate Hell'. Here is how we used GPO, Web Launch, and DAP to survive the cutover."
draft: false
tags: ["cisco", "vpn", "anyconnect", "security", "asa", "wipro"]
---

It was June 2016. The mandate was clear: *Kill the legacy IPSec VPN client. Move everyone to Cisco AnyConnect SSL VPN.*

On paper, it looked easy. In reality, it was a logistical nightmare involving 5,000 users spread across 3 continents.

## The Challenge: Certificate Hell

SSL VPN relies on trust. The ASA presents a certificate. If the user's laptop doesn't trust the Root CA, the browser screams "Unsafe!" and blocks the connection.

We realized too late that 20% of the fleet—mostly contractors—didn't have our internal Root CA installed. If we flipped the switch, 1,000 people would be locked out.

## The Solution: GPO and Web Launch

We attacked on two fronts.

**1. The Silent Push (GPO)**
For corporate assets, we used Active Directory Group Policy (GPO) to silently push the new Root CA and the AnyConnect MSI installer to 4,000 machines before the cutover date.

**2. The Safety Net (Web Launch)**
For the contractors, we configured **Clientless SSL VPN (Web Launch)** on the ASA.
Instead of needing the client pre-installed, they could browse to `https://vpn.company.com`, log in via the web portal, and the ASA would push the installer down to them (Java/ActiveX style).

## The Config: Cisco ASA WebVPN

Here is the snippet that enabled the seamless web-based installation:

```bash
webvpn
 enable outside
 anyconnect image disk0:/anyconnect-win-4.2.0-k9.pkg 1
 anyconnect enable
 tunnel-group-list enable
 
tunnel-group DefaultWEBVPNGroup webvpn-attributes
 authentication aaa
 group-alias "Corporate_VPN" enable
```

## The Policy: Dynamic Access Policies (DAP)

Connecting is one thing; staying secure is another. We didn't want infected home laptops jumping onto the network.

We configured **Dynamic Access Policies (DAP)** to check the endpoint posture.

* *Does it have Antivirus?*
* *Is the Firewall on?*

If `Antivirus = False`, the DAP rule would catch them and apply a "Quarantine" ACL, giving them access only to the remediation server to download AV updates.

## The Lesson

**User friction is the enemy of security.**
If your VPN requires a 10-page manual to install, users will find a way to bypass it (or just email documents to their personal Gmail). Make it invisible, or make it easy.
