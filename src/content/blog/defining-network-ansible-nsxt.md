---
title: "Infrastructure as Code: Deploying the Entire Network with Ansible"
date: 2020-07-22
description: "Manually creating 100 VLANs took 3 days. I wrote an Ansible playbook to do it in 4 minutes. If your infrastructure isn't in Git, does it even exist?"
draft: false
tags: ["nsx-t", "ansible", "automation", "iac", "devops", "ntt-data"]
---

> "Manual configuration is 'Snowflake' infrastructure—unique, fragile, and unrepeatable. Code is 'Phoenix' infrastructure—burn it down, and it rises again exactly the same."

It was July 2020. I was at **NTT Data**, building a private cloud for a healthcare giant.

The requirement was simple: Create **100 Logical Segments** (VLAN-backed overlay) for a new multi-tenant environment.

**The Manual Way:**
Click "Add Segment", type Name, type VLAN ID. Repeat 100 times.

* **Estimated time:** 3 days.

---

# The Solution: Ansible

I decided to treat the network as code. I utilized the `vmware.ansible_nsxt` collection.

First, I defined the "State" of the network in a simple **YAML** file.

```yaml
# tenants.yml
segments:
  - name: "Tenant_A_Web"
    gateway: "10.1.1.1/24"
    vlan: 101
  - name: "Tenant_A_App"
    gateway: "10.1.2.1/24"
    vlan: 102
  - name: "Tenant_A_DB"
    gateway: "10.1.3.1/24"
    vlan: 103
```

# The Playbook

Then, I wrote the logic. The `nsxt_policy_segment` module is **idempotent**—if the segment exists, it does nothing.

```yaml
- name: "Deploy NSX-T Segments"
  hosts: localhost
  tasks:
    - name: "Create Logical Segments"
      nsxt_policy_segment:
        hostname: "{{ nsx_manager }}"
        display_name: "{{ item.name }}"
        state: "present"
        transport_zone_id: "{{ tz_overlay_uuid }}"
        subnets:
          - gateway_address: "{{ item.gateway }}"
      loop: "{{ segments }}"
```

# The Impact

I ran the playbook.
`changed: [localhost] => (item=Tenant_A_Web)`...

**4 minutes.**

The entire network topology was deployed while I finished my coffee.

### Key Takeaway

**If it isn't in Git, it doesn't exist.**

Moving from manual "ClickOps" to Infrastructure as Code isn't just about speed; it's about reliability.
