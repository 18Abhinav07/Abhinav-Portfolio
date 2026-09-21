---
title: "The Second Build Was Mostly Wiring"
date: "2026-09-21"
summary: "GuardianKane started as a PRD-to-task tool, became a Stop-hook gate, and then got rebuilt across twelve numbered phases. The lesson of the rebuild: most of it was connecting data that Kane CLI or my own hooks already produced, and the first phase fixed a bug that broke every fresh install."
tags: ["AI Agents", "Claude Code", "Testing", "Architecture"]
project: "guardiankane"
kind: "teardown"
series: "guardiankane"
seriesPart: 1
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790006266/portfolio/dispatches/agents-lie/cover-s2-1.png"
coverAlt: "Part 01 of 02 cover: three stacked eras, PRD tool, Stop-hook gate, and 12-phase loop, with thirteen phase markers, under the title The second build was mostly wiring."
syndicate: ["devto"]
draft: false
---

My first series, [Your agent might actually lie to you](/dispatches/series/your-agent-might-lie),
is about one shape of GuardianKane: a Claude Code Stop hook that will not let the agent
finish until [Kane CLI](https://testmuai.com) has checked the work in a real browser.
That shape placed 2nd in the TestMuAI Kane CLI hackathon, and four paired experiments
stand behind it.

It is not what GuardianKane is today. The hook is still there, but it is one piece of
a larger system: a reviewed PRD, a phase model, a live scope guard, a file lock, a
secret scan, and a dashboard with graph views and a chat panel wired into the running
Claude Code session. This is the story of how it got there. Part 2 is the tour of
what it looks like.

## Three shapes, one repo

![GuardianKane's three eras. Era 1 on August 20 morning: a PRD tool with no verification, commits f2a3c59, 664259f, cea4ae2, bd19e0d. Era 2 on August 20 to 21: the Stop-hook gate with bug memory, a one-command install and four A/B experiments, commits 896bc57 and b05fc4a. Era 3 from August 26: a phased, reviewed loop across phases 0 to 12.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002784/portfolio/dispatches/agents-lie/diagram-eras.png)

The repo's `JOURNEY.md` records each shape against the commits that built it.

**Era 1 was a planning tool.** The first four commits are a design spec, an
implementation plan, a task-tracker library, and a Claude Code skill with a thin
`kane-cli` wrapper. You gave it a PRD and got back a `task-tracker.md`: tasks with ids,
titles, PRD references, and dependencies. Nothing checked whether a task marked done
was done.

**Era 2 was the gate.** The same afternoon, `896bc57` added the Stop and PostToolUse
hooks with the full decision table, and a day of running the loop against real apps
turned it into the product the first series describes: scripted replay, a defect
sweep, bug memory, an installer, and the four paired experiments. Two demo videos
come from this era, a
[14-minute walkthrough](https://youtu.be/efTl_ZSmXUw) and a
[3-minute cut](https://youtu.be/-4gbIv9hv_M).

**Era 3 started five days later.** It opens with a new dashboard on August 26 and then
runs through twelve numbered phases, each with its own design spec and implementation
plan under `docs/superpowers/`. The current build has its own
[demo video](https://youtu.be/TfVm0yNzBJE).

## Why rebuild something that worked

The v2 design spec opens with the problem, and it is not "the gate was broken". It is
that asking a coding agent to generate tests for a system produces "on the order of
hundreds of assertions, all green", that do not exercise real browser behaviour and do
not map to what the PRD asked for. The spec calls these AI-slop tests and names two
separate things wrong with them.

The first is that they are **push-based**. The agent reads the PRD once, generates
everything it can think of, and stops. v2 makes verification pull-based: a person (or
later the Stop hook) selects concrete nodes in a graph of the codebase, and only
those nodes' claims get tested.

The spec is careful about how much that buys, and I want to keep that care here. An
earlier draft said v2 fixed both problems "by construction". An independent review
caught it, and the spec now says pull-based targeting narrows scope, not depth. A
vague instruction fed to the same browser agent can still produce a shallow pass. What
v2 guarantees is that verification is aimed at something a person deliberately
pointed at, not that any given run is rigorous.

The second problem is **no memory of where**. Era 2's bug memory could say "this looks
like a bug we have seen before" by comparing failure text, but it never
recorded which files were involved, so it could not say "this exact set of files was
fixed on the 20th and has regressed". v2 keys its knowledge memory by the set of
graph nodes under test.

## The phase that fixed every fresh install

Before any new feature, the plan for Era 3 audited what Kane CLI already did and what
GuardianKane was duplicating. Its conclusion became the architecture:

![Who owns what after the rebuild. Kane CLI owns the claim graph, review, coverage and gaps, reconcile, and the recorded reasoning behind every generated test. GuardianKane owns tasks, phases, the Stop-hook gate, the file-touch record, and the dashboard. The twelve phases grouped as gate, knowledge, guardrails, and visibility. Unit tests: 241 after Phase 1, 387 after Phase 11, 460 of 460 today.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790006647/portfolio/dispatches/agents-lie/diagram-ownership.png)

GuardianKane's job narrowed to orchestration. Kane owns the claim graph, coverage,
reconcile, and explanations; GuardianKane owns tasks, phases, the gate, and the
dashboard.

The same audit found the bug that became Phase 0. Kane CLI will not generate tests for
a use case that has not been reviewed. It refuses with
`uc-1 is unreviewed`, and the fix is `kane-cli context review --approve`. The plan
records that `context review` was "never called anywhere in the current codebase". So
on any fresh install, test design failed on the first use case. I do not have data on
why my Era 2 runs never tripped over it.

Phase 0 (`39aaeaa`) wires the review step in, so every grilled use case and every
generated test is approved before it counts. That is also the honest version of what
"PRD grilling" means in the current build: a requirement is extracted, questioned,
and reviewed before anything is built against it.

## Twelve phases, and what most of them had in common

| Phase | What it added | Built on |
|---|---|---|
| 0 | Review gate | a Kane command nothing called |
| 1 | Per-AC evidence and tamper detection | Kane's sealed evidence packs |
| 2 | Phase model in the tracker | the existing tracker schema |
| 3 | Context injection before a task starts | `context explain` / `design explain`, which make no model calls |
| 4 | Live scope guard | the PostToolUse hook's file-touch record |
| 5 | Gaps panel | `kane-cli cover gaps --json`, which nothing called |
| 6 | Review card with per-AC acknowledgment | the task's diff and evidence |
| 7 | Reconcile-powered sync | `kane-cli maintain reconcile --plan` |
| 8 | Trace panel | the activity log, never rendered |
| 9 | Stuck-tasks panel | attempt history already written per task |
| 10 | File-level task lock | the same file-touch record |
| 11 | Secret scan and negative-path nudge | the task's scoped diff |
| 12 | Browser review, PRD graph, quick-generate, evidence viewer, Playwright export | the rest of Kane's surface |

Read down the last column. The phase specs say it themselves, over and over:
"already computes", "already fires on every Edit/Write", "nothing in the codebase
calls it today". Phase 5's spec confirms the gaps command was unused with a grep that
returns zero results. Phase 7 replaced a PRD diff I had written by hand with Kane's
own reconcile, because mine was "reimplementing something Kane already computes".

The v2 spec has a phrase for the pattern: the first place v2 "activates dormant data
rather than adding new collection". It is about the `touches` edge in the code graph.
Since Era 2 the PostToolUse hook had recorded every file the agent edited, per task,
and nothing downstream had ever read it. In Era 3 that one record feeds the code
graph, the scope guard, the trace panel, and the file lock.

That is the lesson I would carry to the next tool I build on top of an agent: before
adding collection, grep for what is already collected and never read.

## Where the phases were honest about their limits

A few specs say plainly what their phase does not do, and those are the lines I trust
most.

- **Phase 4** writes scope drift to its own `scope-status.json` instead of the
  existing `graph-status.json`, because the graph rebuild would overwrite the flag
  "often before the dashboard's 5s poll interval catches it". The spec calls it "a
  real write race, not a style preference".
- **Phase 8** found that the PostToolUse hook exits early for anything but `Edit` and
  `Write`, so "nothing is recorded for `Read`, `Grep`, `Glob`, or `Bash`". Half the
  trace it was asked to draw did not exist yet.
- **Phase 10** only warns. There is no PreToolUse hook in the codebase, and PostToolUse
  fires after the edit "has already happened, so it cannot block the edit itself".
  The spec implements the warn half of warn-or-block and says so.

## Who built the second build

This part would not be honest without it. The specs for Phases 3 to 12 carry a status
line saying they were approved "under the standing full-autonomy delegation",
self-reviewed or given a separate architect-style review pass, with no per-phase
sign-off from me. Of the 50 most recent commits in my local clone, 29 carry a Claude
Sonnet 5 co-author trailer.

So the rebuild of a tool that exists because agents claim done too early was itself
largely built by an agent working under a delegation. What kept it honest was the same
thing GuardianKane asks of any agent: a written spec per phase, a plan, and a test
suite that has to stay green. The phase specs record 241 of 241 tests passing after
Phase 1 and 387 of 387 after Phase 11. I ran the suite again for this post: 36 test
files, 460 of 460 passing.

That count is unit tests on GuardianKane's own code. It is not evidence that any app
built through the loop is correct. That evidence is the browser runs, and Part 2 shows
some of them failing for reasons that had nothing to do with the app.

## What came after the twelfth phase

The last days of August were not new features. They were fixes found by running the
whole thing against a real project, the
[ecommerce demo](https://github.com/18Abhinav07/guardiankane-ecommerce-demo): the
evidence check keyed off the wrong field, a runner that trusted kane-cli's exit code
over its own structured verdict, a dashboard chat that never replied, and a stored XSS
in the dashboard's own rendering. Every one of those is in Part 2, with the log lines
that exposed them.

---

*Part 1 of 2. The hackathon version is the first series, starting with [the broken chart](/dispatches/agent-shipped-a-broken-chart).
Next: [making verification visible](/dispatches/making-verification-visible), the
dashboard, the graphs, and the chat bridge. The code is at
[github.com/18Abhinav07/adventures-with-kane](https://github.com/18Abhinav07/adventures-with-kane).*
