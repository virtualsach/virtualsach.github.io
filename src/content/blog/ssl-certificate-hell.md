---
title: "SSL Certificate Hell: Managing 200+ Domains Before Let's Encrypt"
date: 2017-01-22
description: "Before ACME and Let's Encrypt, managing certificates was a manual nightmare. We had 200+ expires-at-random domains on F5 LTMs. Here is how we survived the 'Sunday Outage'."
draft: false
tags: ["f5", "ssl", "certificates", "openssl", "operations", "wipro"]
---

> "An expired certificate is exactly the same as a server outage. 45 minutes of a bank being offline because of a text file."

It was January 2017. I was leading Security Operations at **Wipro**.

We managed SSL offloading for over **200 domains** on our F5 LTM farm. This was the dark age before **Let's Encrypt** automation. Certificates expired randomly.

# The Incident

It happened on a Sunday morning. A critical banking portal started throwing `NET::ERR_CERT_DATE_INVALID`.

I had to manually generate a new CSR, email it to Symantec, validate via DNS, download the CRT, and upload it to the F5.
**It took 45 minutes.**

---

# The Technical Deep Dive: Client vs. Server SSL

New engineers often confused the two profiles on the F5:

* **Client SSL Profile**: Encryption between **Browser and F5**. This is where your public CA certificate lives.
* **Server SSL Profile**: Encryption between **F5 and Backend Server**. Usually self-signed.

The outage was on the Client SSL side.

# The Systemic Fix

We couldn't rely on Outlook Reminders. I wrote a bash script that iterated through our domains and used **OpenSSL** to check expiration:

```bash
echo | openssl s_client -servername secure.bank.com -connect secure.bank.com:443 2>/dev/null | openssl x509 -noout -enddate
```

I fed this into a dashboard. If any date was `< 30 days`, the screen turned red.

### Key Takeaway

**Visibility is the only cure for complexity.**

If you don't know when your certs expire, you don't own your infrastructure; it owns you.
