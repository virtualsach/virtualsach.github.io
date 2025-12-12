---
title: "The VPN Nightmare: Migrating 5,000 Users to AnyConnect"
date: 2016-06-15
description: "We had to move 5,000 users from legacy IPSec to AnyConnect SSL VPN. Then we hit 'Certificate Hell'. Here is how we used GPO, Web Launch, and DAP to survive the cutover."
draft: false
tags: ["cisco", "vpn", "anyconnect", "security", "asa", "wipro"]
---

> "On paper, it looked easy. In reality, it was a logistical nightmare involving 5,000 users spread across 3 continents."

It was June 2016. The mandate was clear: *Kill the legacy IPSec VPN client. Move everyone to Cisco AnyConnect.*

# The Challenge: Certificate Hell

SSL VPN relies on trust. The ASA presents a certificate.

We realized too late that **20% of the fleet**—mostly contractors—didn't have our internal **Root CA** installed. If we flipped the switch, 1,000 people would be blocked.

---

# The Solution

We attacked on two fronts.

**1. The Silent Push (GPO)**
For corporate assets, we used **Active Directory GPO** to silently push the Root CA and the MSI installer to 4,000 machines.

**2. The Safety Net (Web Launch)**
For contractors, we configured **Clientless SSL VPN**.
They browsed to `https://vpn.company.com`, logged in, and the ASA pushed the installer down (Java/ActiveX).

## The Config: Cisco ASA WebVPN

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

We didn't want infected home laptops jumping onto the network.

We configured **DAP** to check endpoint posture:

* *Does it have Antivirus?*
* *Is the Firewall on?*

If `Antivirus = False`, the DAP rule applied a **Quarantine ACL**, restricting access to the remediation server.

### Key Takeaway

**User friction is the enemy of security.**

If your VPN requires a 10-page manual to install, users will find a way to bypass it. Make it invisible, or make it easy.
