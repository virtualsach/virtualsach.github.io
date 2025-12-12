---
title: "The Pivot: Why I Replaced My CLI with Python"
date: 2016-04-10
description: "I used to manage 50+ firewalls by hand. Then I wrote my first Python script using Netmiko, turned a 4-hour chore into 3 minutes, and never looked back."
draft: false
tags: ["python", "automation", "netmiko", "firewall", "wipro", "devops"]
---

> "I did the math. 5 minutes per box x 50 boxes = 4 hours. 4 hours of mind-numbing, error-prone grunt work."

It was April 2016. The request: *"Update the SNMP community string on all 50 devices."*

# The Old Way: Notepad Engineer

1. SSH into Firewall.
2. Paste from Notepad.
3. `wr mem`.
4. Repeat x 50.

I dreaded the afternoon.

---

# The Epiphany

I decided to try **Python** and **Netmiko**.
I wrote a clumsy script. No error handling. No logging. But it had a loop.

## The Code

```python
from netmiko import ConnectHandler

firewalls = ['192.168.1.10', '...'] # 50 IPs
commands = ['snmp-server community MONITORING RO', 'write memory']

for ip in firewalls:
    print(f"Connecting to {ip}...")
    net_connect = ConnectHandler(device_type='cisco_asa', ip=ip, ...)
    net_connect.send_config_set(commands)
    net_connect.disconnect()
```

# The Result

I ran the script. Text scrolled across my screen.
*Connecting... Success.*

**3 minutes.**
The entire fleet was updated.

### Key Takeaway

**If you type the same command three times, script it.**

That was the moment the "CLI Engineer" in me died. For scale, Code is the only way forward.
