---
title: "How I Wired Kane CLI Into Claude Code"
date: "2026-09-21"
summary: "A Stop hook, a tracker file, and three kane-cli commands. What GuardianKane is, the exact wiring that makes Claude Code prove a task in a real browser before it may stop, and the five things about driving a browser agent from a hook that I did not expect."
tags: ["Claude Code", "Testing", "AI Agents", "Hooks"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 2
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002776/portfolio/dispatches/agents-lie/cover-2.png"
coverAlt: "Part 02 cover: a wire running from a Claude Code session into a browser window, under the title How I wired Kane CLI into Claude Code"
syndicate: ["devto"]
draft: false
---

Claude Code has a hook called `Stop`. It fires every time the agent finishes a turn and
is about to hand control back to you. If the hook prints `{"decision": "block"}` with a
reason, the agent does not stop. It reads the reason and keeps working.

That one mechanism is the whole foundation of GuardianKane. Everything else in this post
is about what I put behind it: [Kane CLI](https://testmuai.com), TestMuAI's browser
agent, driving a real headless Chrome against the app the agent just built, and a
state machine that decides whether "I'm done" is allowed to be true.

I built it for the TestMuAI Kane CLI hackathon, where it placed 2nd. This is the
walkthrough I would have wanted before I started: what it is, the exact wiring, and
what surprised me.

## What I built

GuardianKane is a verification loop around Claude Code. You give it a PRD. It grills
the PRD for ambiguity, turns it into a tracker of tasks, has Kane generate a browser
test for each task, and then gets out of the way. Claude works through the tracker as
usual. When it marks a task `CLAIMED_DONE` and tries to stop, the hook takes over.

![Diagram of a Claude Code session: the agent claims a task done, the Stop hook fires, Kane CLI replays the task's test and runs a defect sweep in headless Chrome against the dev server, and the hook either blocks the stop with a reason or advances the task to KANE_VERIFIED](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002786/portfolio/dispatches/agents-lie/diagram-loop.png)

*Where Kane CLI sits. The agent never calls Kane itself; the hook does, every time.*

It did not start this big. The repo went through three shapes, and the history is
worth knowing because each shape was a response to something the previous one could
not do.

![Timeline of three eras: a PRD-to-tracker tool with no verification, then the Stop-hook gate proven across four A/B experiments, then twelve numbered build phases adding a review gate, scope guard, security gate, and dashboard](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002784/portfolio/dispatches/agents-lie/diagram-eras.png)

*Three shapes, one repo. Hashes from `JOURNEY.md`.*

The first four commits were a planning tool: PRD in, `task-tracker.md` out, nothing
checked. Commit `896bc57` added the Stop and PostToolUse hooks with the full decision
table, and that is when it became a gate. The four paired experiments in parts 1, 3
and 4 of this series were run against that shape. The current shape adds twelve
phases on top: a review gate on every extracted use case, per-acceptance-criterion
evidence, a live scope guard, a secret scan, and a dashboard.

## The wiring

### 1. Two hook entries

This is the entire Claude Code side. The installer merges it into your project's
`.claude/settings.json` without overwriting hooks you already have:

```json
{
  "hooks": {
    "Stop": [{ "hooks": [{ "type": "command", "command": ".claude/hooks/guardian-kane-stop.sh" }] }],
    "PostToolUse": [{ "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": ".claude/hooks/guardian-kane-post-tool-use.sh" }] }]
  }
}
```

`PostToolUse` records which files each task touched, which feeds the scope guard and
the trace. `Stop` is where verification happens.

### 2. A tracker the agent can write, but not all the way

`task-tracker.md` holds one YAML row per task: `id`, `title`, `prd_ref` (the exact PRD
line range it implements), `test_file`, `depends_on`, `verification_mode`, and `state`.
Claude is allowed to move a task to `IN_PROGRESS` and `CLAIMED_DONE`. Only the hook is
supposed to write any `KANE_*` state. That asymmetry is the point. The agent can say it
is done; it cannot say it is verified. (It is a rule the agent is told, not a lock on
the file. Part 6 covers what that costs.)

### 3. The decision function

The hook calls a pure function, `decide()`, with every side effect injected: the dev
server probe, the Kane runner, the sweep runner, the evidence checks, the logger, and
bug memory. That made the whole state machine unit testable without a browser, which
mattered more than I expected once the table grew. In order, it checks:

1. Is a task stuck in `KANE_VERIFYING` for more than five minutes? Reset it. A crashed
   run must not hang the loop.
2. Is anything `CLAIMED_DONE`? If not, allow the stop.
3. Is the dev server answering? If not, allow with a warning. You cannot verify what is
   not running.
4. Did a passing test quietly lose an assertion? That escalates straight to a human.
5. Does the diff contain a secret? Deny.
6. Run the task's Kane test. Exit 1 denies. Exit 2 or 3 is infra, so state is left alone.
7. Did the sealed evidence pack prove every claimed acceptance criterion individually?
8. Run the defect sweep. Clean means `KANE_VERIFIED`. Anything else denies.

A third failure on the same task escalates to `BLOCKED_NEEDS_HUMAN`, which is part 6.

### 4. Three kane-cli commands

The scripted replay for one test file:

```js
spawnSync('kane-cli',
  ['testmd', 'run', testFilePath, '--agent', '--headless', '--variables', variables],
  { encoding: 'utf8', timeout: 5 * 60 * 1000, killSignal: 'SIGKILL', detached: true });
```

`variables` is a JSON object that points `start_url` at the local dev server, so the
same generated test runs against whichever app you aim it at. That is also how I
cross-tested the unassisted builds: same test files, different URL.

For tasks with several test files, a batch: `kane-cli testrun run <files...> --headless
--parallel <n>`, capped at three in parallel.

The defect sweep is not a test file at all. It is a free-text objective:

```js
const objective =
  `Go to ${appUrl} and thoroughly inspect the current implementation of ` +
  `"${task.title}"${prdRef}. Look for visual defects, layout problems, ` +
  `missing or broken elements, console errors, or anything that does not ` +
  `match the stated requirement. Report any issue found.`;
// kane-cli run <objective> --agent --headless --bug-detection stop --url <appUrl>
```

### 5. Speaking back to Claude

When `decide()` denies, the entry script prints the shape Claude Code expects from a
Stop hook:

```js
const out = { decision: 'block', reason: result.permissionDecisionReason };
process.stdout.write(JSON.stringify(out));
```

The reason is written for the agent, not for me. It names the task, the attempt count,
Kane's summary of what failed, and the instruction that matters most: flip the task back
to `IN_PROGRESS`, fix the code, and claim done again. There is no path from "the browser
proved this broken" back to "done" that does not go through the code.

## What surprised me

### Exit codes lie, in both directions

I started by mapping `kane-cli`'s exit code straight into the decision table. That was
wrong twice. A `testmd run` could exit 1 while its own final `run_end` JSON line reported
`status: 'passed'` with every step passing. And a sweep could exit 0, because the
objective "completed", while its verdict reported a confirmed bug.

So the hook parses the last `run_end` line of stdout and trusts the structured verdict
over the process status. For sweeps, a finding means `verdict.confirmed === true`. If
you wire any agentic tool into a gate, read its structured output. The exit code is a
summary of a summary.

### Killing the process does not kill the browser

`kane-cli` spawns its own descendants: a runner, and under that the headless Chrome
instances. A timeout that sends SIGKILL to the child you spawned leaves those running as
orphans, still holding a debugging port. I found this live, after a timeout had already
returned its verdict and Chrome was still up.

The fix is to spawn with `detached: true`, which makes the child its own process group
leader, and then kill the negative pid after every run, timed out or not:

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

SIGKILL rather than SIGTERM for the same reason: a hung run waiting on its own daemon
did not act on SIGTERM in time, so the timeout did not bound wall clock.

### Timeouts are a design input, not a safety net

During the booking experiment, several runs hung well past their own 300 second
internal timeout. One ran for more than 17 minutes before I killed it. That is why the
staleness reset exists: any task sitting in `KANE_VERIFYING` for over five minutes goes
back to `IN_PROGRESS` automatically. On the ORBITAL build the reset fired on the very
first task, the scaffold, between two infra errors. It is the least interesting code in
the repo and one of the most used.

### The verifier fails more often than the app

This is the big one, and it gets its own post (part 5). On the ORBITAL build, six tasks
failed their scripted tests and needed an override. `kane-cli`'s own triage marked all
six `confirmed: false`, `automation_bug`. The one real problem the gate found in twelve
tasks came from the sweep, not from a scripted test. I built the gate to catch the agent.
Most of what it caught was itself.

### Batch results need a second look

Three batches on ORBITAL (T9, T10, T11) were logged as failed with the reason line "all
members passed". Isolating the files, and re-authoring where needed, showed the same
story each time: the feature steps passed, and a redundant final re-check stalled. I do
not have data on whether that mismatch came from `kane-cli`'s batch summary or from my own parsing of it,
so the rule I follow now is the boring one: when a batch fails, run its members one by
one before believing it.

## What it looks like when it runs

When Claude tries to stop with a task open, you see a denial instead of a silent pass.
The dashboard, opt-in with `npm run dashboard`, shows the same loop visually. The Trace
panel is my favorite: for each task, what the agent inspected, what it changed, and what
a real test run proved.

![GuardianKane dashboard Trace panel: a per-task timeline split into inspected, changed, and proved, sourced from real test runs](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002801/portfolio/dispatches/agents-lie/dash-trace.png)

*The Trace panel. "Proved" only fills in from a real Kane run.*

## Try it

You need `git`, `node`, and `kane-cli` authenticated.

```bash
git clone https://github.com/18Abhinav07/adventures-with-kane.git
cd adventures-with-kane
./install.sh /path/to/your/project
```

Run `kane-cli install skill` once per machine, because GuardianKane's skill consults
Kane's own skill for exact command syntax. Then, inside your project in Claude Code:

```
/guardian-kane start ./PRD.md
```

After that, tell Claude to work through the tracker. You never call Kane yourself.

> [!NOTE]
> Kane CLI calls are scoped to whichever org you are logged in to. If a project's Kane
> context was created under a different org, verification fails with an org mismatch.
> Re-run `kane-cli login --oauth` under the right org.

The harness has 460+ unit tests over the decision table, the tracker parser, bug memory
and the dashboard, all with `kane-cli` mocked, so `npm test` runs in seconds with no
browser.

---

*Part 2 of a six-part series. Part 1 was [the broken chart](/dispatches/agent-shipped-a-broken-chart).
Next: [the requirement nobody wrote](/dispatches/the-requirement-nobody-wrote), where the
grilling step earns its place.*
