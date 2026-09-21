---
title: "The Requirement Nobody Wrote"
date: "2026-09-21"
summary: "A four-line todo PRD said priority defaults to Medium and nothing else. One build asked how a task becomes High; the other never did. Then I built a trap for the gate and both builds walked straight past it. Four paired experiments, and the pattern they drew: the gap grows with the density of the spec."
tags: ["AI Agents", "Testing", "Product", "Claude Code"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 2
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790006263/portfolio/dispatches/agents-lie/cover-s1-2.png"
coverAlt: "Part 02 of 03 cover: a PRD page with a dashed lime box around a missing line, under the title The requirement nobody wrote"
syndicate: ["devto"]
draft: false
---

The smallest PRD in my experiments has a section called "Priority badge". It asks for a
badge on each task card, keeps the existing layout, and then says this, which is the
whole specification of priority:

```
just with a small badge showing High/
Medium/Low priority somewhere on the card, defaulting to Medium.
```

Read it again and try to answer one question: how does a task become High?

It does not say. Three values are allowed, one is the default, and there is no
mechanism for reaching the other two. Nobody wrote that part down, and I did not
notice until a tool asked.

## Two builds, one gap

This was the first of four paired experiments. Same PRD, same starting commit, same
operator. `todo-kane` went through the full GuardianKane loop. `todo-baseline` was a
fresh Claude Code agent given the PRD verbatim and told "Build this. Let me know when
it's done." No hooks, no gate, no follow-up.

Both builds worked. The baseline passed the add, complete, delete, and default-badge
tests from the gated build's own suite. On a CRUD app this small you would expect
nothing else. Then I pointed the explicit-priority test at it, and Kane's verdict came
back:

```
confirmed: true
severity: major
"The high-priority task is displayed with a MEDIUM badge instead of High."
```

There was no way, anywhere in the baseline, to set a task to High or Low. You do not
find that by reading the code, because the code is fine for what it does. You do not
find it by clicking around either, because every task shows "Medium" and Medium is a
valid value. The app looks correct right up until someone needs a High.

## Where the question came from

The gated build did not get this right because it was smarter. It got it right
because, before any code existed, GuardianKane's `start` flow ran a grilling pass over
the PRD: a structured conversation whose only job is to find every place the document
is ambiguous and force a decision while deciding is cheap.

![Diagram of the grilling step: the PRD line "Default priority: Medium", the question grilling surfaced about how to set High or Low, the resolved convention of a !high or !low suffix on the title, the test generated under T5, and the unassisted build's confirmed major finding](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002786/portfolio/dispatches/agents-lie/diagram-grilling.png)

*One question during grilling became a convention, a task, and a test.*

The question was the obvious one, once someone asks it. The answer was deliberately
small: a `!high` or `!low` suffix on the title sets the priority and is stripped from
the displayed title. That decision became task T5, and Kane generated a real browser
test around it. The step that gates the task, verbatim from the repo:

```
Assert that the task card titled {{high_priority_task_title}} shows a visible
priority badge whose text is exactly High, and that the same card still shows its
completion checkbox and delete "x" control.
```

T5 could not reach `KANE_VERIFIED` until that held in a real browser, so the gated
build implemented the suffix. The unassisted build never had the question asked, and
resolved the ambiguity the way ambiguity always resolves under pressure: in the
direction of least effort.

## Why an agent will not ask

I do not think this is specific to Claude. It is what one-shot building does to any gap
in a spec. The instruction was "build this", and the spec was satisfiable as written:
every card has a badge, the badge can show Medium, Medium is the default. An agent
optimizing to finish will not invent a requirement that makes the task bigger, and it
will not stop to ask, because stopping to ask looks like not finishing.

A human engineer would probably have asked in standup. The grilling step moves that
standup question to before the first line of code, and then turns the answer into
something executable. A decision in a chat log can be forgotten. A decision in a test
file cannot be skipped.

One smaller finding from the same experiment keeps me honest about what that buys.
Re-running the priority test against the gated build itself, Kane flagged that the
badge's CSS uppercases the text, so the screen reads "HIGH" while the DOM says "High".
It was `confirmed: false`, severity minor, and it had not failed the gate originally.
A verified task is verified against what was asserted at the time, not against every
assertion anyone could write later. Verification is only as wide as the questions you
asked before it ran.

## So I built a trap

The fair criticism of the todo result was that it was too forgiving. The gap only
existed because one PRD happened to leave an ambiguity. I wanted a task that would
stress the gate itself.

A room booking widget: pick a start and end time, create a booking, reject any booking
that overlaps an existing one. The PRD is explicit about the edge:

```
If the new range overlaps any existing booking, reject it with a visible
error and do not create it. Two bookings that merely touch (one's end
time equals the other's start time) are NOT overlapping and must be
allowed.
```

This is the textbook off-by-one. Write `<=` where you meant `<` and the widget rejects
perfectly valid back-to-back bookings. It is invisible unless a test builds two
bookings that share a boundary, and it is exactly what I expected a one-shot build to
get wrong.

Both builds got it right. `booking-kane` used `aStart < bEnd && aEnd > bStart`.
`booking-baseline` used `aStart < bEnd && bStart < aEnd`. Same logic, operands in a
different order, both strict. The gated build ended with a verdict-confirmed record
across all 12 scored tests. The baseline completed 6 of 12, including the trap, and
passed every one it completed. No confirmed divergence.

My trap caught nothing.

## Why I did not bury it

It would have been easy to leave that experiment out. It produced two things I value
more than a dramatic screenshot.

**It turned a claim into a fact.** Before the cross-test, "the baseline handles
touching bookings" was the baseline agent's own self-report: the exact kind of
sentence this project exists to distrust. After it, it was a verified result. The code
did not change. What changed was whether anyone had to take an agent's word for it.

That is the less glamorous half of what a gate does. People picture it catching bugs.
Most of the time it converts "I believe this works" into "a browser watched it work",
and when the answer is yes, nothing visibly happens. A good verification system spends
most of its life producing null results.

**It kept the numbers honest.** Six of the baseline's tests never completed, because
`kane-cli` was flaky on this task throughout; one run hung for more than 17 minutes
before I killed it. Two of the gated build's raw failures were `confirmed: false`,
`automation_bug`: Kane's own analysis said the UI had already rejected the bad
booking. Scored by exit code, this experiment would have reported bugs in the gated
build that did not exist. That thread gets pulled all the way in Part 3.

## Then I made the PRD denser

The todo and booking PRDs were thin. Neither gave a one-shot build much room to drop
anything. The third experiment kept the booking domain and loaded the PRD with detail:
exact hex colors, an 8px spacing scale, corner radii, a header row with 16px padding, a
250ms shake on conflict, an auto-dismissing toast with a progress bar, a 5 second
Undo that restores the exact cancelled booking, a persisted theme, and rules for what
Escape closes first. Every one of those is checkable, and every one is easy to drop.

The gated build reached `KANE_VERIFIED` on 8 of 10 requirement groups. The other two,
toast stacking and cancel with undo, failed six attempts between them, all six
`confirmed: false`: Kane's browser agent was too slow to act inside the few seconds
the toast was on screen.

A manual side-by-side found one concrete divergence, on the unassisted build. Its
header rendered with the title and theme toggle flush against the viewport edge. The
PRD asks for 16px of padding. The gated build had it. One missed value: real,
specific, and modest.

## The shape across four experiments

Line the four up by how dense the PRD was, and a pattern shows up that I did not
design for.

![Four cards ordered by PRD density. Todo app, low: the baseline failed only the explicit High or Low priority check nobody wrote down. Room booking, medium: no confirmed divergence. Booking studio, high: 8 of 10 requirement groups verified on the gated build, and the baseline header missing its 16px padding. ORBITAL, very high: a doubled chart, a two-column alert list, and uneven spacing on the baseline](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002790/portfolio/dispatches/agents-lie/diagram-scoreboard.png)

*The gap grew with the density of the PRD.*

Sparse PRDs produced small gaps or none. The denser the spec, the more places an
unsupervised single pass had to quietly drop something. By ORBITAL, Part 1's build,
the unassisted agent had a doubled chart, a wrong alerts layout, and uneven spacing.

Four experiments, one operator, one pair of builds each. That is a pattern worth
writing down, not a law. But it matches what I believe from building with agents:
Claude is already strong at small, well-scoped builds. A gate earns its keep in the
long tail of a dense spec, where "looks right at a glance" and "is actually right"
start to come apart. And the most valuable thing it did in these four experiments was
not the browser check. It was the question asked before the build.

## If you write PRDs for agents

Read every enumerated value and ask how each one is reached. Read every default and
ask what the non-default path is. Read every "can" and ask what "cannot" looks like.
Those three habits would have caught the priority gap.

Better, do not rely on your own reading. The gap sat in plain sight in two lines of
text, and nobody saw it until something was built to look. Put a step in the loop
whose only job is to ask, and make its answers executable.

And design experiments that can fail. If every experiment you run says your tool is
useful, you have probably only run the ones that could.

---

*Part 2 of 3. Previously: [the broken chart](/dispatches/agent-shipped-a-broken-chart).
Next: [who verifies the verifier?](/dispatches/who-verifies-the-verifier), on the
failures that were never the app's fault, and a retry cap the agent could edit.*
