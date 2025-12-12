---
title: "Clicking is for Amateurs: Automating Security with PowerNSX"
date: 2018-09-22
description: "Creating 500 firewall rules by hand in the vSphere Web Client is a recipe for carpal tunnel. Here is how I used PowerNSX and a CSV file to deploy an entire tenant's security in 45 seconds."
draft: false
tags: ["nsx", "powershell", "powernsx", "automation", "security", "ibm"]
---

> "I had to create 500 Distributed Firewall rules. The Web Client took 6 clicks per rule. That's 3,000 clicks. It was going to take all week."

It was September 2018. New tenant onboarding at **IBM**.
I refused to accept the "ClickOps" fate.

# The Solution: PowerNSX

I defined the entire policy in a simple **CSV file**:

| Section | Source | Destination | Service | Action |
| :--- | :--- | :--- | :--- | :--- |
| Tenant_APP | SG_Web | SG_App | HTTPS | Allow |
| Tenant_Default | Any | Any | Any | Block |

---

# The Code: CSV to API

I wrote a PowerShell script using `New-NsxFirewallRule`.

```powershell
Import-Module PowerNSX
$rules = Import-Csv "C:\configs\firewall_rules.csv"
$section = New-NsxFirewallSection -Name "Tenant_A_Policy"

foreach ($rule in $rules) {
    # Get Objects
    $src = Get-NsxSecurityGroup -Name $rule.Source
    $dst = Get-NsxSecurityGroup -Name $rule.Destination

    # Push Rule
    New-NsxFirewallRule -Section $section `
                        -Name "Allow_$($rule.Source)" `
                        -Source $src `
                        -Destination $dst `
                        -Action $rule.Action
}
```

# The Result

I hit "Run". The console flashed for **45 seconds**.
I hit Refresh in vSphere. 500 rules, perfectly ordered, active.

### Key Takeaway

**GUI is for learning. API is for earning.**

In the modern era, you cannot be a "Point-and-Click" admin. Automation isn't just about speed; it's about consistency and saving your wrists.
