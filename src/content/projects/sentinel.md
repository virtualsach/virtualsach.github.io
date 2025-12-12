---
title: "Project Sentinel: AI Infrastructure Anomaly Detection"
date: 2025-01-10
summary: "Using Prometheus metrics and Unsupervised Learning to predict outages before they happen."
tags: ["Python", "TensorFlow", "Prometheus", "AI"]
description: "Self-healing infrastructure powered by predictive AI."
---

# Project Sentinel

**Role**: Tech Lead  
**Stack**: Python, TensorFlow, Prometheus, Grafana  
**Status**: Beta / Iterate

## The Challenge

Static thresholds for alerts (e.g., "CPU > 80%") are noisy and ineffective. We were getting woken up at 3 AM for spikes that were actually normal batch processing jobs.

## The Solution

**Sentinel** is a sidecar service that scrapes Prometheus metrics and applies an unsupervised learning model (Isolation Forest) to detect *true* anomalies.

### How it Works

1. **Training**: The model trains on 30 days of historical metric data to understand "seasonality" (e.g., traffic is naturally higher on Monday mornings).
2. **Scoring**: Real-time metrics are scored. If the deviation exceeds the dynamic confidence interval, an alert is fired.
3. **Feedback Loop**: On-call engineers can mark an alert as "False Positive", retraining the model to be smarter next time.

## Impact

- **Alert Fatigue**: Reduced pager noise by **85%**.
- **Proactive**: Detected a memory leak in the payment service 48 hours before it would have caused an OOM crash.

> "Sentinel is the difference between sleeping through the night and firefighting until dawn."
