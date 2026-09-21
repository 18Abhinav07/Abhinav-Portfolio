---
title: "Who Verifies the Verifier?"
date: "2026-09-21"
summary: "On the densest build, eight tasks failed a browser check and one of them was a real bug. The rest were the verifier, and then my own write-up turned them into findings. Notes on checking the thing that checks, and on a three-strike retry cap the agent could quietly reset."
tags: ["AI Agents", "Testing", "Verification", "Claude Code"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 3
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790006264/portfolio/dispatches/agents-lie/cover-s1-3.png"
coverAlt: "Part 03 of 03 cover: verdict chips reading status failed, confirmed false, and automation_bug, beside a magnifier with a lime question mark, under the title Who verifies the verifier?"
syndicate: ["devto"]
draft: false
---

The premise of this series is that you should not take an agent's word that it is
done. So I built a gate that makes Claude Code prove each task in a real browser
before it may stop. The browser is driven by Kane CLI, which is itself an agent.

The obvious question arrives late and uncomfortably: why would I take that agent's
word either?

This is the part of the story where the gate turns around and looks at itself. It has
three layers: the verifier's failures, my own, and the rule that decides when to stop
asking.

## Twelve tasks, eight failures, one bug

ORBITAL is the densest build in the project, the one with the doubled chart from
Part 1. Every task went through the gate, and the Stop hook wrote each attempt to an
append-only activity log. Here is the whole build, from that log.

![Grid of the thirteen ORBITAL tasks, T0 to T12, each labeled with its outcome: T0 infra errors and a stale reset then a clean sweep, T1 passed on retry, T2 T3 T4 T9 T10 T11 human overrides after automation failures, T5 T6 T8 T12 clean on the first try, and T7 caught by the sweep, fixed in 43 minutes, then clean](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002788/portfolio/dispatches/agents-lie/diagram-orbital-trail.png)

*12 of 12 verified. One sweep catch. Six overrides.*

Eight tasks failed a check at least once. T1 failed on an assertion timing mismatch
after the navigation it was checking had already happened, and passed on retry. Six
more (T2, T3, T4, T9, T10, T11) failed badly enough to need a human-reviewed override.
For every one of the six, `kane-cli`'s own triage came back `confirmed: false`, family
`automation_bug`. The causes were specific:

- **T2, the performance chart.** Three attempts, three different failure points. One
  opened the wrong page entirely. Triage pointed at flaky headless hover targeting and
  an ambiguous unlock-state assertion.
- **T3, the allocation donut.** The test asserted a hover effect without ever hovering
  the segment first. The script was missing a step.
- **T4, the holdings table.** A legitimate layout fix invalidated recorded replay
  baselines. Re-recorded with `--author`, all eight test files passed.
- **T9, T10, T11.** The feature steps passed, then a redundant final re-check stalled.
  On T11 the browser agent oscillated between two buttons until it detected a cycle in
  its own plan.

The eighth was T7, the sweep catch from Part 1. That was the one real problem in the
app across twelve tasks.

Eight failures, one bug. Read by exit code, all eight look the same.

## The rule I ended up with

Every raw `failed` result gets read against the verifier's structured verdict:
`verdict.confirmed`, `family`, `category`, and confidence. Never the exit code. Then,
before an override is allowed:

1. Re-run the failing test alone, not inside a batch.
2. Get `kane-cli`'s triage on the repeated failure.
3. Find direct evidence the feature works: a step in the same run that passed, a fresh
   recording, or a manual check in a real browser.
4. Only then clear it, with the rationale written into the log next to the evidence.

The same held across the other experiments. On the booking studio, six toast-timing
failures were Kane's agent being too slow for a four second toast. On the todo build,
a persistence check looked under the storage key the other build happened to use.

A slow verifier, a brittle assertion, a stale recording. None of those is the app. All
of them look exactly like the app from outside.

## Then I re-read my own write-up

This is the part I did not expect to write.

While putting this series together I went back to the repo's build log,
`OBSERVATIONS-AND-REPORTINGS.md`, and checked each ORBITAL claim against the raw
activity log. My write-up had done to the verifier's failures exactly what the
verifier had done to the app.

![Four rows comparing my build notes with the raw activity log. T2: the notes say the sweep caught a real chart lock-state defect; the log shows three scripted failures triaged as automation_bug. T3: the notes say a sweep-caught issue on the donut; the log shows the test never hovered before asserting. T4: the notes say a sweep-caught issue on the table; the log shows stale replay baselines, 8 of 8 passing once re-recorded. T9: the notes say the export raced its toast; the log shows all four export toasts confirmed and a redundant final step stalled](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002789/portfolio/dispatches/agents-lie/diagram-reread.png)

*What my write-up said against what the log said.*

The notes say the sweep "caught a real state-tracking defect" on the chart at T2. The
log shows no sweep finding on T2 at all, only three scripted failures that triage
called automation. The notes credit the sweep on T3 and T4; both were test problems.
The notes call T9 "a genuine race"; the log shows all four export toasts confirmed in
the same run and a redundant step failing afterwards.

Kane's `bug_title` fields made this easy to get wrong. Triage titles read like bug
reports: "Replay misclassifies unlocked chart state". Lift that string out of its
context, forget the `confirmed: false` next to it, and it reads as a finding. I lifted
them. The first draft of Part 1 repeated them, before I checked.

The repo's own evidence gif has the same problem. The README captions this one as a
caught defect:

![Kane CLI driving the performance chart's lock interaction and ending the run as failed](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002803/portfolio/dispatches/agents-lie/kane-verify-fail.gif)

*A failed run on the chart lock, evidence pack `31fcd34b`. Every failure on the chart
task was triaged `automation_bug`, so I now read this as the verifier failing, not the
chart.*

## The overrides I am least comfortable with

Look at who cleared each override. T2 was recommended by a second Claude session and
approved by me explicitly. T3 needed triage evidence and then my approval. T4, T9, T10
and T11 were cleared "under standing self-override authorization": a standing grant,
not a fresh decision each time.

The evidence supports each of those calls. But the process got weaker as the build went
on, and the log shows it. A human in the loop who has pre-approved the loop is not
really in it.

## Three strikes, then a human

All of which forces a design question I had to answer in code before I could answer
it in prose. When the gate says no, how many times do you send the agent back? An agent
told "try again" will try forever. It does not get tired or embarrassed. Somebody has
to decide when the loop has stopped producing information and started producing noise.

GuardianKane's answer is three.

![The state machine the Stop hook enforces. PLANNED, IN_PROGRESS, CLAIMED_DONE, KANE_VERIFYING, KANE_VERIFIED in a row. Below: KANE_FAILED routes back to IN_PROGRESS; BLOCKED_NEEDS_HUMAN after the third failure or one case of test tampering; kane-cli exit 2 or 3 leaves state untouched.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002791/portfolio/dispatches/agents-lie/diagram-state-machine.png)

Every gate that can fail a task follows the same shape: increment `attempts`; under
three, set `KANE_FAILED` and deny the stop with a reason; on the third, set
`BLOCKED_NEEDS_HUMAN`. The details around the number matter more than the number:

- **A failure always routes back to `IN_PROGRESS`.** There is no edge from a failed
  check back to `CLAIMED_DONE`. The agent cannot re-assert done on the same code.
- **Escalation is an allow, not a deny.** A deny with no retries left is an
  instruction to keep going with nothing new to say. The allow ends the session and
  leaves the task blocked where a person will see it.
- **Tampering skips the queue.** If a test lost an assertion for a requirement that
  did not change, that is a test being weakened to pass, and it escalates on the first
  occurrence. Retries are for honest mistakes.
- **The verifier's failures are free.** When `kane-cli` exits with an infra error or a
  timeout, state is left alone and no strike is charged. Given everything above, a
  counter that billed the agent for Kane's bad hour would escalate working code.

## The counter that went backwards

The clearest log of the cap in action comes from a later project, an ecommerce demo
built with the rebuilt GuardianKane and committed with its unedited history. The
three-strike rule is unchanged there. Here is its first task, T0:

| Time | Event |
|---|---|
| 20:15:30 | sweep FOUND ISSUE (attempt 1/3): (no summary) |
| 20:27:58 | SECRET SCAN FAILED (attempt 1/3): server.js, high-entropy value assigned to "secret" |
| 20:29:56 | sweep FOUND ISSUE (attempt 2/3): (no summary) |
| 20:30:23 | sweep FOUND ISSUE (attempt 3/3): (no summary) |
| 20:30:23 | BLOCKED_NEEDS_HUMAN after 3 sweep failures |
| 22:11:02 | sweep found no issues, KANE_VERIFIED |

The escalation works. And the log taught me three things.

**The counter went backwards.** The first sweep failure is attempt 1. Twelve minutes
later the secret scan failure is also attempt 1. The hook only ever increments
`attempts`; nothing in it sets the field back to zero. But the counter lives in the
task tracker, a YAML block in a markdown file the agent also edits, because the agent
is the one who flips tasks to `IN_PROGRESS`. Nothing guards that field. I do not have
data on what reset it in this run. The log only shows that it was reset.

That is the most important finding in this series. "Only the hook writes verification
states" is a rule the agent is told, not one the file system enforces, and the same is
true of the retry budget. A cap the capped party can edit is a suggestion. The fix is
to keep `attempts` and the verification states in a file only the hook writes, and
treat the tracker as a view.

**The last two sweeps were not a browser looking at a page.** Attempt 3 started at
20:30:21 and reported an issue at 20:30:23. Two seconds, no summary. A sweep drives a
real browser against a running app; a two-second verdict with nothing behind it is not
evidence about the app. The escalation was reached mostly on verdicts like that, which
is the lesson from the top of this post again.

**The human step is invisible.** T0 sits blocked for about an hour and a half, then
comes back clean. Whatever happened in between, a fix, a restart, a tracker edit, is
not in the log, because the log only records what the hook does. For an audit trail,
the most consequential step, a person deciding to reopen a blocked task, is the one it
cannot see.

## Why three

I do not have data that three is the right number. I did not run the loop with two or
five and compare. What I am more confident about is the structure around it: honest
failures retry, tampering does not, the verifier's own failures do not count, and the
budget has to live somewhere the agent cannot write. The hackathon version got the
first three right.

## What this changes about the thesis

It does not weaken it. It sharpens it.

The original claim was "do not trust the agent's self-report". The better claim is "do
not trust any unverified claim, including the verifier's, including your own summary
of the verifier". Each layer needs its structured evidence kept next to its
conclusion, so the next reader can check the step instead of the sentence.

In practice: read structured verdicts, not exit codes. Keep confidence and family next
to every finding, everywhere it is quoted. And go back to the raw log when you write it
up, because the summary is where the drift happens.

The raw log was right the whole time. Everything that went wrong went wrong in a
summary.

That is also where the hackathon version runs out. A pass or fail line in a terminal
cannot show you what the agent touched, which requirements are only designed and which
are proven, or which failures were the checker. Answering that took a second build,
and it is a different story.

---

*Part 3 of 3, and the last. Previously: [the requirement nobody wrote](/dispatches/the-requirement-nobody-wrote).
The story continues in [GuardianKane: it will not let your agent lie](/dispatches/series/guardiankane),
starting with [the second build was mostly wiring](/dispatches/the-second-build-was-mostly-wiring).*
