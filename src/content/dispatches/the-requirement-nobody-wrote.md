---
title: "The Requirement Nobody Wrote"
date: "2026-09-21"
summary: "A four-line todo PRD said priority defaults to Medium and said nothing else. One build asked how you set High. The other never did, and every task quietly showed Medium. The bug was not in the code; it was in the question nobody asked."
tags: ["AI Agents", "Testing", "Requirements", "Product"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 3
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002777/portfolio/dispatches/agents-lie/cover-3.png"
coverAlt: "Part 03 cover: a PRD page with a blank line highlighted, under the title The requirement nobody wrote"
syndicate: ["devto"]
draft: false
---

The smallest PRD in my experiments has a section called "Priority badge". It asks for a
badge on each task card, keeps the existing card layout as it is, and then says this,
which is the whole specification of priority:

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
fresh Claude Code agent given the PRD verbatim in one message and told "Build this. Let
me know when it's done." No hooks, no gate, no follow-up.

Both builds worked. The baseline passed the add, complete, delete, and default-badge
tests from the gated build's own suite. Persistence passed in substance. On a CRUD app
this small, you would expect nothing else. Then I pointed the explicit-priority test at
it, and Kane's verdict came back:

```
confirmed: true
severity: major
"The high-priority task is displayed with a MEDIUM badge instead of High."
```

The baseline had implemented the documented default and nothing more. There was no way,
anywhere in the app, to set a task to High or Low. That is not a bug you find by
reading the code; the code is fine for what it does. It is not a bug you find by
clicking around either, because every task shows "Medium" and Medium is a valid value.
The app looks correct right up until someone needs a High.

## Where the question came from

The gated build did not get this right because it was smarter. It got it right because
before any code existed, GuardianKane's `start` flow ran a grilling pass over the PRD: a
structured conversation whose only job is to find every place the document is ambiguous
and force a decision while deciding is cheap.

![Diagram of the grilling step: the PRD line "Default priority: Medium", the question grilling surfaced about how to set High or Low, the resolved convention of a !high or !low suffix on the title, the test generated under T5, and the unassisted build's confirmed major finding](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002786/portfolio/dispatches/agents-lie/diagram-grilling.png)

*One question during grilling became a convention, a task, and a test.*

The question it surfaced was the obvious one, once someone asks it: how does a user or
the app ever set a task to High or Low? The answer we settled on was deliberately small.
A `!high` or `!low` suffix on the task title sets the priority and is stripped from the
displayed title. That decision became task T5 in the tracker, and Kane generated a real
browser test around it. Step 1 of that test, verbatim from the repo:

```
Open {{start_url}} in a browser and wait until the TodoMVC page is fully loaded.
In the new-task input, create a task titled "{{high_priority_task_title}} !high" by
pressing Enter, then create a second task titled "{{low_priority_task_title}} !low"
by pressing Enter ...
```

And the step that gates the task:

```
Assert that the task card titled {{high_priority_task_title}} shows a visible
priority badge whose text is exactly High, and that the same card still shows its
completion checkbox and delete "x" control.
```

T5 could not reach `KANE_VERIFIED` until that assertion held in a real browser. So the
gated build implemented the suffix. The unassisted build, which never had the question
asked, resolved the ambiguity the way ambiguity always resolves under pressure: in the
direction of least effort.

## Why an agent will not ask

I do not think this is a flaw specific to Claude. It is what one-shot building does to
any gap in a spec. The instruction was "build this". The spec was satisfiable as
written: every card has a badge, the badge can show Medium, Medium is the default. An
agent optimizing to finish will not invent a requirement that makes the task bigger,
and it will not stop to ask, because stopping to ask looks like not finishing.

A human engineer would probably have asked in standup. The value of the grilling step
is that it moves that standup question to before the first line of code, and then turns
the answer into something executable. A decision that lives in a chat log can be
forgotten. A decision that lives in a test file cannot be skipped.

## Passing is not the same as complete

There is a second, smaller finding in the same experiment that keeps me honest about
what the gate proves.

When I re-ran the explicit-priority test against the gated build itself, Kane flagged a
mismatch: the badge's CSS applies `text-transform: uppercase`, so the screen reads
"HIGH" while the DOM value is "High". Kane marked it `confirmed: false`, severity
`minor`. It had not failed the gate originally; the replay was simply stricter than
the original authoring run.

That is not a scandal, but it is a real limit. A `KANE_VERIFIED` task is verified
against what was asserted and gated at the time. It is not verified against every
assertion Kane could write later. Verification is only as wide as the questions you
asked before it ran.

## How the current version treats requirements

That todo experiment was run against the early shape of GuardianKane, the plain Stop-hook
gate. What it taught me shaped most of what came after.

**Every extracted use case gets reviewed.** Grilling extracts use cases from the PRD, and
each one, along with each generated test, now has to pass `kane-cli context review
--approve` before it counts. Extraction is not the same as agreement.

**Security gets a negative-path question.** For anything touching access control, the
grilling pass asks what should be refused, not only what should work. A PRD almost
never states the negative case, which makes it the single most likely requirement
nobody wrote.

**Drift is visible.** The PRD graph has a Gaps and drift panel driven by `kane-cli cover
gaps --json`. It separates what the design covers from what a test has actually proven,
and every gap comes with a one-click fix command.

![GuardianKane dashboard PRD graph with the Gaps and drift panel open: design coverage 100 percent across 21 acceptance criteria, proven 53 percent with 10 of 21, and 14 pending gaps each listing a fix command](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002796/portfolio/dispatches/agents-lie/dash-gaps-drift.png)

*The e-commerce demo: 21 of 21 acceptance criteria designed, 10 of 21 proven. The gap
between those two numbers is the honest state of the project.*

That screenshot is the thesis of this post as a single panel. Design coverage says every
requirement has a plan. Proven coverage says how many of those plans a browser has
actually confirmed. A project that reports only the first number is reporting what it
intends, not what it has.

**PRD edits do not sync themselves.** Nothing watches `PRD.md`. If you change a
requirement after `start`, you run `/guardian-kane sync`, which runs `kane-cli maintain
reconcile --plan` and shows which tasks are now stale and which use cases need
re-grilling. There is no file watcher, and I think that is right: an edit to a
requirement should be a deliberate event with a visible changeset, not something that
happens to you.

## What I would tell someone writing a PRD for an agent

Read every enumerated value and ask how each one is reached. Read every default and ask
what the non-default path is. Read every "can" and ask what "cannot" looks like. Those
three habits would have caught the priority gap.

Better still, do not rely on your own reading. The gap sat in plain sight in a couple
of lines of text, and nobody saw it until something was built to look. Put a step in
the loop whose only job is to ask, and make its answers executable.

---

*Part 3 of a six-part series. Previously: [how I wired Kane CLI into Claude Code](/dispatches/wiring-kane-cli-into-claude-code).
Next: [the experiment where nothing happened](/dispatches/the-experiment-where-nothing-happened),
which turned out to be one of the more useful results.*
