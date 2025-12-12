---
title: "Project Titan: Monolith to Microservices"
date: 2024-08-20
summary: "Strangler Fig migration of a 10-year-old Java monolith to a federated Go microservices mesh."
tags: ["Kubernetes", "Istio", "Java", "Go"]
description: "Breaking the monolith without breaking the business."
---

# Project Titan

**Role**: Staff Engineer  
**Stack**: Java (Spring Boot), Go, Kubernetes (EKS), Istio  
**Status**: Completed

## The Challenge

"The Monolith" was a 10-year-old Java application that took 45 minutes to build and required 2 hours of downtime to deploy. Feature velocity had ground to a halt.

## The Solution

We adopted the **Strangler Fig Pattern** to peel off functionality piece by piece.

### Key Strategies

1. **API Gateway Layer**: Introduced an Istio Ingress Gateway to route traffic. We could steer 1% of traffic to the new microservice and 99% to the monolith transparently.
2. **Database Decoupling**: Used "Change Data Capture" (CDC) via Debezium to sync data from the monolith's Oracle DB to the new microservices' PostgreSQL instances.
3. **Polyglot Freedom**: While the monolith was Java, new services were written in **Go** for high throughput and low memory footprint.

## Outcomes

- **Deployment Velocity**: From 1 deployment/week to 50+ deployments/day.
- **Onboarding**: New engineers could run a single microservice locally in minutes, rather than struggling to boot the entire monolith.
