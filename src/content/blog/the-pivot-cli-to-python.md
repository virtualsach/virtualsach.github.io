---
title: "The Pivot: Why I Replaced My CLI with Python"
date: 2016-04-10
description: "I used to manage 50+ firewalls by hand. Then I wrote my first Python script using Netmiko, turned a 4-hour chore into 3 minutes, and never looked back."
draft: false
tags: ["python", "automation", "netmiko", "firewall", "wipro", "devops"]
---

It was April 2016. I was deep in the trenches at Wipro, managing a sprawling estate of over 50 perimeter firewalls (mostly ASA and Checkpoint).

The request seemed simple enough: *"Update the SNMP community string on all devices for the new monitoring system."*

## The Old Way: The "Notepad Engineer"

In the past, this meant:

1. Open SecureCRT.
2. SSH into Firewall #1.
3. Copy the config commands from Notepad.
4. Paste.
5. `wr mem`.
6. Disconnect.
7. Repeat 49 more times.

I did the math. 5 minutes per box (including login, hiccups, and "did I just paste that into the wrong window?" paranoia) x 50 boxes = **~4 hours**.

4 hours of mind-numbing, error-prone grunt work. I stared at my terminal, dreading the afternoon.

## The Epiphany

I had been hearing about "Network Automation" and people using Python. I decided to try it. I spent an hour reading about a library called **Netmiko** (built by the legend Kirk Byers) that simplified SSH connections for network devices.

I wrote a clumsy script. It didn't have error handling. It didn't have logging. But it had a loop.

## The Code

Here is the logic that changed my career. It took a list of IP addresses and applied the config set.

```python
from netmiko import ConnectHandler

# The list of target devices
firewalls = ['192.168.1.10', '192.168.1.11', '192.168.1.12', '...'] # and 47 more

# Common credentials (in 2016, we often shared these... don't judge)
username = 'admin'
password = 'MySecretPassword123!'

commands = [
    'snmp-server community MONITORING RO',
    'snmp-server location DATA_CENTER_1',
    'write memory'
]

print("Starting Mass Update...")

for ip in firewalls:
    device = {
        'device_type': 'cisco_asa',
        'ip': ip,
        'username': username,
        'password': password,
    }

    try:
        print(f"Connecting to {ip}...")
        net_connect = ConnectHandler(**device)
        
        output = net_connect.send_config_set(commands)
        print(output)
        
        net_connect.disconnect()
        print(f"Success: {ip}")
        
    except Exception as e:
        print(f"Failed to update {ip}: {e}")

print("Job Complete.")
```

## The Result

I ran the script. Text scrolled across my screen faster than I could read it.

*Connecting... Success.*
*Connecting... Success.*

**3 minutes.**

The entire fleet was updated in 3 minutes. I checked a few random boxes to verify. They were perfect.

That was the moment the "CLI Engineer" in me died, and the "Network Automator" was born.

## The Lesson

I made a rule for myself that day: **If you type the same command three times, script it.**

The CLI is fantastic for exploration, troubleshooting, and learning syntax. But for operation? For scale? Code is the only way forward.
