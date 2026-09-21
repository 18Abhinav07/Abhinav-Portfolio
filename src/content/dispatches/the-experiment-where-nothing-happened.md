---
title: "The Experiment Where Nothing Happened"
date: "2026-09-21"
summary: "I built a booking widget around a classic off-by-one trap so the gate would have something to catch. Both builds got it right. Here is why that null result is one of the more useful things the project produced, and what happened when I made the PRD denser."
tags: ["Testing", "AI Agents", "Experiments", "Claude Code"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 4
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002778/portfolio/dispatches/agents-lie/cover-4.png"
coverAlt: "Part 04 cover: two booking slots, 10:00 to 11:00 and 11:00 to 12:00, touching at a single boundary, under the title The experiment where nothing happened"
syndicate: ["devto"]
draft: false
---

After the todo experiment, the fair criticism was that it was too forgiving. The gap it
found only existed because the PRD happened to leave an ambiguity, and the grilling
step happened to resolve it. That is a real result, but it is a result about one PRD's
wording. I wanted a task that would stress the gate itself.

So I designed a trap.

## The trap

A room booking widget. You pick a start and end time, it creates a booking, and it
must reject a booking that overlaps an existing one. The PRD is explicit about the edge:

```
If the new range overlaps any existing booking, reject it with a visible
error and do not create it. Two bookings that merely touch (one's end
time equals the other's start time) are NOT overlapping and must be
allowed.
```

So a booking from 10:00 to 11:00 and another from 11:00 to 12:00 must coexist.

This is the textbook off-by-one. Write `<=` where you meant `<` anywhere in the
overlap check and the widget will reject perfectly valid back-to-back bookings. The
bug is invisible unless a test builds two bookings that share a boundary. It is
exactly the kind of thing I expected a one-shot build to get wrong and a gated build to
be forced to get right.

Both apps were scaffolded from nothing, not forked: `booking-kane` through the full
GuardianKane loop, `booking-baseline` by a fresh Claude Code agent given the PRD in one
message and told to self-check with lint, build and curl, then stop. Then both were
cross-tested with the same Kane-generated test files.

## Both got it right

`booking-kane` used `aStart < bEnd && aEnd > bStart`. `booking-baseline` used
`aStart < bEnd && bStart < aEnd`. Same logic, operands in a different order, both
strict. Both allowed touching bookings. The gated build also rejected real overlaps in
all three variants of that test; the baseline's overlap tests never finished, for
reasons I will get to.

The gated build ended with a complete, verdict-confirmed record across all 12 scored
tests. The baseline completed 6 of 12, including the touching-bookings trap, and passed
every one it completed. There was no confirmed divergence between them.

My trap caught nothing.

## Why I did not bury it

It would have been easy to leave this experiment out. It does not produce a screenshot
of a broken chart. But it produced two things I value more than a dramatic finding.

**It turned a claim into a fact.** Before the cross-test, the statement "the baseline
handles touching bookings correctly" was the baseline agent's own self-report. That is
the exact kind of sentence the whole project exists to distrust. After the cross-test,
it was a verified result. The code did not change. What changed was whether anyone had
to take an agent's word for it.

That is the less glamorous half of what a gate does. People picture it catching bugs.
Most of the time it does something quieter: it converts "I believe this works" into "a
browser watched it work", and when the answer is yes, nothing visibly happens. A good
verification system spends most of its life producing null results. That is not a
failure mode; it is the job.

**It kept me honest about the numbers.** Six of the baseline's tests never completed,
so this experiment does not prove the two build processes are equivalent in general.
All it shows is that on this trap, both got it right. I have to say that plainly or
the rest of the series is not worth reading.

## Where the unfinished tests went

The reason six baseline tests never completed is itself a finding. `kane-cli` was
flaky on this task throughout. Several runs of the same test file hung well past their
own 300 second internal timeout. One ran for more than 17 minutes before I killed it.

Two of the gated build's raw failures also turned out not to be failures. The test for
rejecting an end time before the start time came back `failed`, and so did the one for
end equal to start. Inspected individually, both verdicts were `confirmed: false`,
`automation_bug`. Kane's own analysis said the UI had already shown the booking was
rejected. The app was right; the check stumbled.

And one test was excluded for both apps. It had been authored without an explicit
navigation step, so it ran against whatever page a stale browser session happened to
have open. It was not testing either app.

If I had scored this experiment by raw exit codes, I would have reported bugs in the
gated build that did not exist, and a scoring gap that was really a tooling gap.

## Then I made the PRD denser

The booking widget and the todo app both had thin specifications. Neither gave a
one-shot build much room to drop anything. So the third experiment kept the same
booking domain and loaded the PRD with detail: exact hex colors, an 8px spacing scale,
corner radii, a header row with 16px padding, a 250ms shake on conflict, a toast that
slides in and auto-dismisses with a shrinking progress bar, a 5 second Undo that
restores the exact cancelled booking, a persisted theme key, and rules for what Escape
closes first. Every one of those is independently checkable, and every one is easy to
drop.

The gated build reached `KANE_VERIFIED` on 8 of 10 requirement groups. The remaining
two, toast stacking and cancel with undo, failed six attempts between them, and all six
came back `confirmed: false`. Kane's own reasoning said the app behaved correctly and
its browser agent was too slow to act inside the four to five second window the toast
was on screen. Other tests that exercised the same toast component passed.

A manual side-by-side check found one concrete divergence, on the unassisted build. Its
header row rendered with the title and the theme toggle flush against the viewport
edge. The PRD asks for 16px of padding around that row. The gated build had it.

One missed padding value. That is the honest size of the gap on that experiment:
real, specific, and modest.

## The shape across four experiments

Line the four experiments up by how dense the PRD was, and a pattern shows up that I
did not design for.

![Four cards ordered by PRD density. Todo app, low: the baseline failed only the explicit High or Low priority check nobody wrote down. Room booking, medium: no confirmed divergence. Booking studio, high: 8 of 10 requirement groups verified on the gated build, and the baseline header missing its 16px padding. ORBITAL, very high: a doubled chart, a two-column alert list, and uneven spacing on the baseline](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002790/portfolio/dispatches/agents-lie/diagram-scoreboard.png)

*The gap grew with the density of the PRD.*

The sparse PRDs produced small gaps or none. The denser the specification, the more
places an unsupervised single pass had to quietly drop something, and the more visible
the drop became. By ORBITAL, part 1 of this series, the unassisted build had a doubled
chart, a structurally wrong alerts layout, and inconsistent spacing.

I want to be careful with this. Four experiments, one operator, one pair of builds per
experiment. That is a pattern worth writing down, not a law. But it matches something
I believe from building with agents: Claude is already strong at small, well-scoped
builds. The value of a gate is not in the easy cases. It is in the long tail of a dense
spec, where "looks right at a glance" and "is actually right" start to come apart.

## What I took from nothing happening

Design experiments that can fail, and publish them when they do. If every experiment
you run confirms your tool is useful, you have probably only run the ones that could.

The booking trap was the experiment that could have made GuardianKane look pointless.
Instead it showed me what the tool does on an ordinary day: it proves things, quietly,
and every so often it is wrong about its own failures. Both of those turned out to
matter more than the one day it catches something dramatic.

---

*Part 4 of a six-part series. Previously: [the requirement nobody wrote](/dispatches/the-requirement-nobody-wrote).
Next: [who verifies the verifier?](/dispatches/who-verifies-the-verifier), on the failures
that were never the app's fault.*
