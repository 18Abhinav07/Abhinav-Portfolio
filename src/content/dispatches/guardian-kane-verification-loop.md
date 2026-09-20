---
title: "What I Learned Wiring Kane CLI Into a 12-Phase Verification Loop"
date: "2026-09-24"
summary: "Four A/B builds, one silent chart regression the baseline shipped, and an honest null result. What actually changes when an agent has to prove it is done."
tags: ["AI Agents", "Testing", "Kane CLI", "Verification"]
project: "guardiankane"
draft: true
---

> **DRAFT — outline only.** Structure is locked; prose comes next.
> Source material: `10-Projects/guardian-kane/CONTENT-LOG.md`, `OBSERVATIONS-AND-REPORTINGS.md`, `JOURNEY.md`.

## The problem: "done" is a claim, not a fact

Open on the failure mode, not the project. An agent reporting success is an assertion with
no evidence attached. Everything else follows from that.

## What I built

Guardian Kane in two paragraphs. The 12-phase loop. What each gate actually blocks.

## How Kane CLI was wired in

The integration itself — where it sits in the loop, what it verifies, what it hands back.
Include the real config. This is the section TestMu asked for.

## The experiment: four builds, baseline vs gated

Set up the A/B honestly: booking, booking-studio, orbital, todo.

### ORBITAL — the doubled chart line

The strongest result. Baseline shipped a visibly wrong chart; the gated build caught it.
Screenshot both. This is the single most shareable artifact in the whole project.

### Experiment #2 — no divergence

**Keep this section.** Both builds got the boundary trap right. The null result is the most
credible thing in the post, and it is what most people would quietly drop.

## What surprised me

- `BLOCKED_NEEDS_HUMAN` after 3 attempts mattered more than any passing gate
- The Jaccard bug-memory store, and what it stopped
- 460+ tests and what mutation testing said about them

## What I'd do differently

Short, specific, no false modesty.

---

*Built during the Kane CLI hackathon ([TestMu](https://testmu.ai)) — 2nd place.
Code: [adventures-with-kane](https://github.com/18Abhinav07/adventures-with-kane).*
