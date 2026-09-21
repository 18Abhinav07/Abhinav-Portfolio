---
title: "Who Verifies the Verifier?"
date: "2026-09-21"
summary: "On the ORBITAL build, six tasks failed their browser tests and every one of the six was the test automation, not the app. Then I re-read my own write-up of those failures and found it had turned them into bugs. Notes on checking the thing that checks."
tags: ["Testing", "AI Agents", "Verification", "Claude Code"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 5
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002779/portfolio/dispatches/agents-lie/cover-5.png"
coverAlt: "Part 05 cover: a checkmark being inspected by a second checkmark, under the title Who verifies the verifier?"
syndicate: ["devto"]
draft: false
---

The premise of this whole series is that you should not take an agent's word that it
is done. I built a gate that makes Claude Code prove each task in a real browser before
it may stop. The browser is driven by Kane CLI, which is itself an agent.

So the obvious question arrives late and uncomfortable: why would I take that agent's
word either?

This post is about what happened when I stopped doing that. It has two parts. The
first is about the verifier's failures. The second is about mine.

## Twelve tasks, eight failures, one bug

ORBITAL is the densest build in the project: a single-page portfolio dashboard with
twelve interactive subsystems. Every task went through the gate, and the Stop hook
wrote each attempt to an append-only activity log. Here is the whole build, task by
task, from that log.

![Grid of the thirteen ORBITAL tasks, T0 to T12, each labeled with its outcome: T0 infra errors and a stale reset then a clean sweep, T1 passed on retry, T2 T3 T4 T9 T10 T11 human overrides after automation failures, T5 T6 T8 T12 clean on the first try, and T7 caught by the sweep, fixed in 43 minutes, then clean](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002788/portfolio/dispatches/agents-lie/diagram-orbital-trail.png)

*12 of 12 verified. One sweep catch. Six overrides.*

Eight tasks failed a check at least once. T1 failed on an assertion timing mismatch
after the navigation it was checking had already happened, and passed on retry. Six
more (T2, T3, T4, T9, T10, T11) failed their scripted tests badly enough to need a
human-reviewed override. For every one of the six, `kane-cli`'s own bug triage came
back `confirmed: false`, family `automation_bug`. The causes were specific:

- **T2, the performance chart.** Three attempts, three different failure points. One
  opened the wrong page entirely. Triage between 0.76 and 0.93 confidence pointed at
  flaky headless hover targeting and an ambiguous unlock-state assertion.
- **T3, the allocation donut.** The authored test asserted a hover effect without ever
  recording a hover on the segment first. The test script was missing a step.
- **T4, the holdings table.** A legitimate popover-placement fix changed the layout
  and invalidated recorded replay baselines. Re-recorded with `--author`, all eight test
  files passed.
- **T9, T10, T11.** The feature steps passed. In each case a redundant final re-check
  stalled or looped afterwards. On T11 the agent oscillated between two buttons until
  it detected a cycle in its own plan.

The eighth was T7, the alerts panel, and it was different. Both scripted tests
passed; the unscripted defect sweep failed the task anyway. About 43 minutes later the
tests passed again and the sweep came back clean. No override was needed. That was the
one time in twelve tasks the gate caught a real problem in the app, and the loop did
exactly what it was built to do.

Eight failures. One bug. Read by exit code alone, all eight look the same.

## The rule I ended up with

Every raw `failed` result gets inspected against the verifier's own structured verdict:
`verdict.confirmed`, `family`, `category`, and confidence. Not the exit code. Then, for
an override to be allowed:

1. Re-run the failing test in isolation, not as part of a batch.
2. Get `kane-cli`'s bug triage on the repeated failure.
3. Find direct evidence that the feature works: a step in the same run that passed, or
   a fresh recording with `--author`, or a manual check in a real browser.
4. Only then clear it, with the rationale written into the log next to the evidence.

The same discipline held across the other experiments. On the booking studio build, six
attempts on two toast-timing groups came back `confirmed: false`: Kane's browser agent
was too slow to act inside the four to five seconds the toast stayed on screen. On the
todo build, a persistence check failed because it looked for data under the storage key
that the other build happened to use, while the task itself survived the reload.

A slow verifier, a brittle assertion, a stale recording. None of those is the app. All
of them look exactly like the app from the outside.

## Then I re-read my own write-up

Here is the part I did not expect to write.

While putting this series together, I went back to the repo's own build log,
`OBSERVATIONS-AND-REPORTINGS.md`, and checked each claim about ORBITAL against the raw
activity log. My write-up had done to the verifier's failures exactly what the verifier
had done to the app.

![Four rows comparing my build notes with the raw activity log. T2: the notes say the sweep caught a real chart lock-state defect; the log shows three scripted failures triaged as automation_bug. T3: the notes say a sweep-caught issue on the donut; the log shows the test never hovered before asserting. T4: the notes say a sweep-caught issue on the table; the log shows stale replay baselines, 8 of 8 passing once re-recorded. T9: the notes say the export raced its toast; the log shows all four export toasts confirmed and a redundant final step stalled](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002789/portfolio/dispatches/agents-lie/diagram-reread.png)

*What my write-up said against what the log said.*

The notes say the sweep "caught a real state-tracking defect" on the chart at T2. The
log shows no sweep finding on T2 at all; it shows three scripted failures that triage
called automation. The notes say the sweep caught issues on T3 and T4. Both were test
problems. The notes call T9 "a genuine race" between the export and its toast. The log
shows all four export toasts confirmed true in the same run; the failure was a
redundant step afterwards.

The `bug_title` fields made this easy to get wrong. Kane's triage titles read like bug
reports: "Replay misclassifies unlocked chart state", "Agent waited for export toast
without queuing export". Lift those strings out of their context, forget the
`confirmed: false` next to them, and they read as findings. I lifted them. The first
draft of part 1 of this series repeated them, before I checked.

The verification trail page in the repo has the same disease in milder form. Its intro
says three overrides, its headline number says six, its footer says five tasks, and one
caption credits the gate with fixing the chart at T2. The underlying entries are
transcribed faithfully. The summaries on top of them drifted.

## The evidence gifs, captioned honestly

The repo has two gifs built from real Kane evidence packs, the step-by-step screenshots
Kane writes during a run.

![Kane CLI stepping through the ORBITAL alerts feed in a headless browser, ending in a pass](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002804/portfolio/dispatches/agents-lie/kane-verify-pass.gif)

*A clean pass on the alerts feed. Evidence pack `01f77c2f`.*

![Kane CLI driving the performance chart's lock interaction and ending the run as failed](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002803/portfolio/dispatches/agents-lie/kane-verify-fail.gif)

*A failed run on the chart-lock interaction. Evidence pack `31fcd34b`. The README
captions this as a caught defect. Every failure on the chart task was triaged as
`automation_bug`, so I now read it as the verifier failing, not the chart.*

## The part about overrides I am least comfortable with

Look at who cleared each override. T2 was recommended by a second Claude session and
approved by me explicitly. T3 required triage evidence and then my approval. T4, T9,
T10 and T11 were cleared "under standing self-override authorization": a standing grant,
not a fresh decision each time.

Each of those four still has triage and direct evidence attached in the log, and the
evidence supports each call. But the process got weaker as the build went on, and the
log shows it. A human in the loop who has pre-approved the loop is not really in it.

What I would change: an override should be its own state, visible on the dashboard,
that a human acknowledges per task. The evidence can be gathered automatically. The
decision should not be.

## What this changes about the thesis

It does not weaken it. It sharpens it.

The original claim was "do not trust the agent's self-report". The better claim is "do
not trust any unverified claim, including the verifier's, including your own summary of
the verifier". Each layer needs its structured evidence kept next to its conclusion,
so that the next reader can check the step instead of the sentence.

In practice that means three habits. Read structured verdicts, not exit codes. Keep
confidence and family next to every finding, everywhere it is quoted. And when you
write it up, go back to the raw log, because the summary is where the drift happens.

The raw log was right the whole time. Everything that went wrong went wrong in a
summary.

---

*Part 5 of a six-part series. Previously: [the experiment where nothing happened](/dispatches/the-experiment-where-nothing-happened).
Next and last: [three strikes, then a human](/dispatches/three-strikes-then-a-human), on
how the loop decides when to stop asking the agent to try again.*
