---
title: "Project Nebula: Serverless Event Bus"
date: 2024-11-15
summary: "A multi-region serverless event bus capable of handling 50M+ events per day with <200ms E2E latency."
tags: ["AWS", "EventBridge", "Lambda", "Go"]
description: "Architecting a global nervous system for distributed applications."
---

# Project Nebula

**Role**: Lead Architect  
**Stack**: AWS (Lambda, EventBridge, DynamoDB), Go, Terraform  
**Status**: Production

## The Challenge

Our legacy monolithic message queue (RabbitMQ) was becoming a single point of failure. It struggled with cross-region replication and had high operational overhead. As the company expanded to 3 continents, we needed a "Global Nervous System" that was self-healing and infinitely scalable.

## The Solution

I designed **Nebula**, a fully serverless event bus built on AWS EventBridge.

### Architecture Highlights

1. **Event Schema Registry**: Enforced strictly typed JSON schemas for all events using Protobuf definitions, catching bad data at the door.
2. **Global Routing**: Leveraged EventBridge archive and replay features to sync state across us-east-1, eu-central-1, and ap-southeast-1.
3. **Cost Optimization**: Implemented specific filtering rules to only route necessary events, reducing cross-region data transfer costs by 40%.

## Detailed Implementation

We used **Terraform** to define the entire infrastructure.

```hcl
resource "aws_cloudwatch_event_bus" "nebula" {
  name = "nebula-global-bus"
}

resource "aws_cloudwatch_event_rule" "cross_region" {
  event_bus_name = aws_cloudwatch_event_bus.nebula.name
  event_pattern  = jsonencode({
    "detail-type": ["order.created", "payment.processed"]
  })
}
```

## Results

- **Zero Maintenance**: No servers to patch or cluster to manage.
- **Scalability**: Handled a Black Friday peak of 50M events without a single dropped message.
- **Latency**: Reduced end-to-end latency from 1.5s to 200ms globally.
