---
title: "SSL Certificate Hell: Managing 200+ Domains Before Let's Encrypt"
date: 2017-01-22
description: "Before ACME and Let's Encrypt, managing certificates was a manual nightmare. We had 200+ expires-at-random domains on F5 LTMs. Here is how we survived the 'Sunday Outage'."
draft: false
tags: ["f5", "ssl", "certificates", "openssl", "operations", "wipro"]
---

It was January 2017. I was leading the Security Operations team at Wipro. We stood between the internet and 50 different banking and insurance clients.

We managed SSL offloading for over **200 domains** on our F5 LTM farm. And this was the dark age before **Let's Encrypt** automation was ubiquitous. Certificates expired randomly—some after 1 year, some after 3 years, some on Tuesdays, some on Sundays.

## The Incident

It happened on a Sunday morning (naturally). A critical banking portal started throwing `NET::ERR_CERT_DATE_INVALID`.
The certificate had expired at midnight. The VIP (Virtual IP) was up. The servers were healthy. But to the user, the site was dead.

**An expired certificate is exactly the same as a server outage.**

## The Immediate Fix

I had to manually generate a new CSR (Certificate Signing Request) on the F5, email it to the Symantec/DigiCert portal, validate the domain via email/DNS, download the `.crt` file, upload it to the F5, and bind it to the **Client SSL Profile**.

It took 45 minutes. 45 minutes of a bank being offline because of a text file.

## The Technical Deep Dive: Client vs. Server SSL

New engineers often confused the two profiles on the F5:

* **Client SSL Profile**: This handles the encryption between the **Browser and the F5**. This is where your public CA certificate lives (google.com). This allows the F5 to decrypt the traffic, inspect it (WAF), and then pass it on.
* **Server SSL Profile**: This handles the encryption between the **F5 and the Backend Server**. Usually, this uses a long-lived internal self-signed cert.

The outage was on the Client SSL side. The public face of the bank had expired.

## The Systemic Fix

We couldn't rely on "Outlook Calendar Reminders" anymore.
I wrote a bash script that iterated through our list of domains and used **OpenSSL** to check the expiration date from the outside.

**The Command:**

```bash
echo | openssl s_client -servername secure.bank.com -connect secure.bank.com:443 2>/dev/null | openssl x509 -noout -enddate
```

I fed this into a dashboard. If any date was `< 30 days`, it turned the screen red.

## The Lesson

We take automated certificate rotation for granted today. But remember: **Visibility is the only cure for complexity.** If you don't know when your certs expire, you don't own your infrastructure; it owns you.
