---
title: "Why I Chose Rust for Infra Tooling"
date: 2025-03-01
summary: "Moving from Bash and Python to Rust for mission-critical CLI tools: Safety, Speed, and Sanity."
tags: ["Rust", "DevOps", "CLI"]
description: "Zero-cost abstractions in the Ops world."
---

# Why Rust?

I've written thousands of lines of Bash. I've written extensive Python scripts for automation. But recently, I've started reaching for **Rust** for my infrastructure tooling. Here is why.

## 1. The Compiler is my Pair Programmer

In Python, I find out about a `TypeError` at runtime, usually when the script is halfway through deleting resources. In Rust, the code won't even compile if I haven't handled that edge case.

> **Result**: My confidence in running `nuke-resources --prod` has increased tenfold.

## 2. Startup Time Matters

When a Lambda function or a CLI tool runs thousands of times a minute, the startup overhead of the Python interpreter adds up. Rust binaries start instantly and have a negligible memory footprint.

## 3. Fearless Concurrency

Writing multi-threaded Python is... painful (GIL, anyone?). Go is great, but Rust's ownership model ensures I never have data races. I built a tool to scan 10,000 S3 buckets in parallel, and it just worked, blazing fast, without manual mutex management.

## Conclusion

Rust has a steep learning curve, yes. But for "plumbing" code that keeps the platform alive, the safety guarantees are worth every hour spent fighting the borrow checker.
