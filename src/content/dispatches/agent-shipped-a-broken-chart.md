---
title: My Agent Shipped a Broken Chart and Told Me It Was Done
date: '2026-09-21'
summary: >-
  Two builds, one PRD. One rendered a clean performance chart. The other drew
  the same line twice and reported the task complete. How that gap turned a
  planning tool into a Claude Code Stop hook that makes the agent prove its work
  in a real browser, and what the gate caught first.
tags:
  - AI Agents
  - Claude Code
  - Testing
  - Verification
project: guardiankane
kind: teardown
series: your-agent-might-lie
seriesPart: 1
cover: >-
  https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790006262/portfolio/dispatches/agents-lie/cover-s1-1.png
coverAlt: >-
  Part 01 of 03 cover: a line chart drawn twice, slightly offset, under the
  title My agent shipped a broken chart and told me it was done
syndicate:
  - devto
draft: false
devtoId: 4711712
---

The chart looked fine in the code.

The data pipeline was correct. The chart library call had the right shape. Every prop
was passed, every array was populated, and nothing about the component would have
looked suspicious in thirty seconds of review. If you had put that diff in front of me
cold, I would have approved it.

Then I opened the page. The performance chart was rendering the same series twice: two
overlapping traces at slightly different weights, a smeared, doubled line that no one
would ship on purpose.

![The unassisted build's chart: the same data series drawn twice at different stroke weights, producing a visibly smeared and doubled line](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1789917428/portfolio/dispatches/broken-chart/orbital-baseline-2.png)

*The same series, drawn twice. This build reported the task complete.*

The agent that wrote it had already marked the task done.

This series is about that word, "done", and what it took to stop trusting it. It
starts with a tool I built for the TestMuAI Kane CLI hackathon, where it placed 2nd.

## A planner that never checked

GuardianKane did not start as a verifier. The first four commits in the repo are a
planning tool: a design spec, an implementation plan, a task-tracker library, and a
Claude Code skill with a thin `kane-cli` wrapper. You gave it a PRD and got back a
`task-tracker.md`: tasks with ids, titles, the PRD lines each one implements, and
dependencies.

It was tidy, and it had one hole in the middle. The agent worked through the tracker
and moved each task to done when it decided the task was done. Nothing checked. The
tracker was a list of claims, and the planner's whole output depended on believing
them.

The same afternoon, commit `896bc57` added two Claude Code hooks, and the planner
became a gate.

## The gate, in one picture

Claude Code has a hook called `Stop`. It fires every time the agent finishes a turn
and is about to hand control back. If the hook prints `{"decision": "block"}` with a
reason, the agent does not stop. It reads the reason and keeps working.

That is the entire lever. Everything else is what I put behind it.

![Diagram of a Claude Code session: the agent claims a task done, the Stop hook fires, Kane CLI replays the task's test and runs a defect sweep in headless Chrome against the dev server, and the hook either blocks the stop with a reason or advances the task to KANE_VERIFIED](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002786/portfolio/dispatches/agents-lie/diagram-loop.png)

*The agent never calls Kane itself. The hook does, every time it tries to stop.*

The tracker grew a state machine. The agent may move a task to `IN_PROGRESS` and
`CLAIMED_DONE`. Only the hook is supposed to write `KANE_VERIFIED`. The asymmetry is
the point: the agent can say it is done; it cannot say it is verified.

When a task is `CLAIMED_DONE` and the agent tries to stop, the hook drives
[Kane CLI](https://testmuai.com), TestMuAI's browser agent, against the running dev
server in a real headless Chrome. Two checks run per task:

- **A scripted replay.** The test Kane generated for the task, run exactly as
  authored:
  `kane-cli testmd run <file> --agent --headless --variables <json>`, with
  `start_url` pointed at the local server.
- **A defect sweep.** No test file at all, just a free-text objective: open the app,
  read this task's PRD section, and report visual defects, layout problems, missing
  elements, console errors, or anything that does not match the requirement.

If either fails, the hook denies the stop with a reason written for the agent: the
task, the attempt count, Kane's summary of what failed, and one instruction. Flip the
task back to `IN_PROGRESS`, fix the code, and claim done again. There is no path from
"the browser proved this broken" back to "done" that does not go through the code.

Two hook entries in `.claude/settings.json` are the whole Claude Code side:

```json
{
  "hooks": {
    "Stop": [{ "hooks": [{ "type": "command", "command": ".claude/hooks/guardian-kane-stop.sh" }] }],
    "PostToolUse": [{ "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": ".claude/hooks/guardian-kane-post-tool-use.sh" }] }]
  }
}
```

`PostToolUse` quietly records which files each task touched. In this shape of the tool
nothing reads that record. Hold on to it; it becomes the most important data in the
project later.

## Four pairs of builds

To find out whether any of this mattered, I ran four paired experiments. Each pair is
the same PRD given to two builds: one unassisted Claude Code agent told "build this",
and one going through the full GuardianKane loop. The PRDs were a todo app, a room
booking widget, a higher-fidelity booking studio, and ORBITAL: a dense single-page
institutional portfolio dashboard with twelve or so interactive subsystems.

ORBITAL is where the chart came from, because it is the only one of the four with
enough visual density to have somewhere to hide.

The gated build, `orbital-kane`, rendered one clean trend line and a visually distinct
dashed benchmark, which is what the PRD asked for.

![The gated build's portfolio performance chart: a single clean solid trend line with a separate dashed benchmark line beneath it](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1789917425/portfolio/dispatches/broken-chart/orbital-kane-1.png)

*`orbital-kane`. One series, one line.*

The unassisted build, `orbital-baseline`, drew the doubled line at the top of this
post. It also drifted on the alerts panel. The PRD specifies a single-column,
full-width, stacked alert list where one alert expands at a time. The baseline built a
compact two-column grid instead.

![The gated build's alerts panel: full-width alert cards stacked vertically, one expanded with its action visible](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002810/portfolio/dispatches/agents-lie/orbital-kane-3.png)

*`orbital-kane`. Full width, stacked, one expanded.*

![The unassisted build's alerts panel: alert cards squeezed into two columns side by side, with uneven gaps against the panels below](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002808/portfolio/dispatches/agents-lie/orbital-baseline-1.png)

*`orbital-baseline`. Two columns, and the gaps do not match the panels beneath it.*

The same screenshot shows a third problem: the space around the alerts block does not
match the space around the holdings and risk cards directly below it.

Three defects in one build, and not one of them is visible in a diff. A grid class is
not wrong-looking. A chart component that renders one series twice is well formed. The
bugs only exist at the moment of render, so the only way to find them is for something
to look at the rendered page.

## What the gate actually caught

Going in, I assumed the scripted replay was the valuable half of the gate. It is
deterministic and repeatable; it is what you would build first. I built the sweep
almost as an afterthought and was mildly embarrassed by how fuzzy it was.

The ORBITAL activity log says otherwise. Twelve tasks, all twelve reached
`KANE_VERIFIED`. The sweep flagged something exactly once, on T7, the alerts panel.
Both scripted tests for T7 had just passed. They covered expand and switch behavior
and asserted nothing about layout. The sweep failed the task anyway and sent it back to
`IN_PROGRESS`. About 43 minutes later the tests passed again and the sweep came back
clean.

That log line carries no summary text, so I cannot tell you what the sweep saw. The
alerts panel is the same panel the unassisted build got wrong, which is a tempting
story. I have no data connecting the two, so I am not telling it.

What I can say is that it was the only failure in the whole build that was a real
problem with the app. And the pattern underneath it is general: a scripted test can
only check what you thought to assert. The defects that ship are, almost by
definition, the ones nobody thought to assert. A strategy made only of assertions
written in advance cannot catch the thing most likely to hurt you.

## Two things the wiring taught me

**Exit codes lie, in both directions.** I first mapped `kane-cli`'s exit code straight
into the gate. A replay could exit 1 while its own final `run_end` line reported
`status: 'passed'` with every step passing. A sweep could exit 0, because the objective
"completed", while its verdict reported a confirmed bug. The hook now parses the last
structured line and trusts the verdict over the process status. If you wire any
agentic tool into a gate, read its structured output. The exit code is a summary of a
summary.

**Killing the process does not kill the browser.** `kane-cli` spawns its own runner,
and under it the headless Chrome instances. A timeout that kills the child you spawned
leaves those running as orphans, still holding a debugging port. The fix is to spawn
detached, so the child leads its own process group, and kill the whole group after
every run:

```js
function killProcessGroup(pid) {
  if (!pid) return;
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    // ESRCH: group already empty
  }
}
```

## What I take from it

The naive reading is "agents are unreliable, add tests." That was already the advice
before I started, so it is not a finding.

The more precise reading is that the failure was never in the code generation. Claude
wrote a chart component that was, structurally, fine. The failure was in the
self-report. An agent saying "done" is an assertion with no evidence attached, and my
first tool had treated that assertion as a state transition.

I have to be careful about what the gated build proves. Its chart was right, but the
log does not show the gate catching a doubled chart and forcing a fix. The gated build
also had its PRD grilled for ambiguity before any code existed, and twelve tasks each
scoped to a PRD section. Which of those made the difference, one pair of builds cannot
tell me.

The narrower claim holds. In the gated build, nothing reached "done" on the agent's
word. In the unassisted build, "done" was a sentence, and the sentence was wrong.

There is a version of this that is just CI, and for a lot of projects CI is enough.
What CI does not give you is a check inside the agent's own loop, before it stops,
while it still has the context to fix what it broke. By the time CI goes red, the
session is over. The gate fires while the agent is still standing there.

The rest of this series is about the two surprises that followed. The first is where
the gated build's advantage actually came from, and it was not the browser. The second
is that of the eight ORBITAL tasks that failed a check, seven were not the app's fault
at all.

---

*Part 1 of 3. Next: [the requirement nobody wrote](/dispatches/the-requirement-nobody-wrote),
on the question that separated the builds and the experiment that found nothing.
The code is at [github.com/18Abhinav07/adventures-with-kane](https://github.com/18Abhinav07/adventures-with-kane).*
