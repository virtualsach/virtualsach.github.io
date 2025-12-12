---
title: "Clicking is for Amateurs: Automating Security with PowerNSX"
date: 2018-09-22
description: "Creating 500 firewall rules by hand in the vSphere Web Client is a recipe for carpal tunnel. Here is how I used PowerNSX and a CSV file to deploy an entire tenant's security in 45 seconds."
draft: false
tags: ["nsx", "powershell", "powernsx", "automation", "security", "ibm"]
---

It was September 2018. We were onboarding a new multi-tenant environment at IBM. The design was solid, but the implementation plan was brutal.

I had to create **200 Security Groups** and over **500 Distributed Firewall (DFW) rules** for the new tenant.

I opened the vSphere Web Client (the Flash-based one... *shudder*). It took 6 clicks just to create one rule. 6 clicks x 500 rules = 3,000 clicks. Not counting the lag. It was going to take all week.

## The Solution: PowerNSX

I refused to accept that fate. I had been playing with **PowerNSX**, a PowerShell module that wraps the NSX API.

## The Approach: CSV to API

Instead of clicking, I opened Excel. I defined the entire security policy in a simple CSV file:

| Section | Source | Destination | Service | Action |
| :--- | :--- | :--- | :--- | :--- |
| Tenant_APP | SG_Web | SG_App | HTTPS | Allow |
| Tenant_APP | SG_App | SG_DB | Oracle_TCP | Allow |
| Tenant_Default | Any | Any | Any | Block |

## The Code

I wrote a script to iterate through this CSV and push the config. Here is the core logic using `New-NsxFirewallSection` and `New-NsxFirewallRule`.

```powershell
Import-Module PowerNSX
Connect-NsxServer -vCenterServer vcenter.corp.local

$rules = Import-Csv "C:\configs\firewall_rules.csv"

# Create the Section first
$section = New-NsxFirewallSection -Name "Tenant_A_Policy"

foreach ($rule in $rules) {
    Write-Host "Creating rule: $($rule.Source) -> $($rule.Destination)"
    
    # Get the objects
    $src = Get-NsxSecurityGroup -Name $rule.Source
    $dst = Get-NsxSecurityGroup -Name $rule.Destination
    $service = Get-NsxService -Name $rule.Service

    # Push the rule to NSX
    New-NsxFirewallRule -Section $section `
                        -Name "Allow_$($rule.Source)_to_$($rule.Destination)" `
                        -Source $src `
                        -Destination $dst `
                        -Service $service `
                        -Action $rule.Action
}

Write-Host "Deployment Complete!"
```

## The Result

I hit "Run".

The console flashed for about **45 seconds**.

I went back to the vSphere Web Client and hit refresh. There they were. 500 rules, perfectly ordered, properly named, and active.

## The Lesson

**GUI is for learning. API is for earning.**

If you are a Systems Engineer in the modern era, you cannot afford to be a "Point-and-Click" admin. Automation isn't just about speed; it's about consistency, auditability, and saving your wrists.
