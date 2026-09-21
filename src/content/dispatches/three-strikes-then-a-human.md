---
title: "Three Strikes, Then a Human"
date: "2026-09-21"
summary: "A verification loop that can say no also needs a rule for when to stop saying it. How GuardianKane caps retries at three, which failures skip the queue, what its memory remembers, and the one log that shows the counter doing something the code never does."
tags: ["Testing", "AI Agents", "Claude Code", "Security"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 6
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002781/portfolio/dispatches/agents-lie/cover-6.png"
coverAlt: "Part 06 cover: three struck attempts followed by a hand, under the title Three strikes, then a human."
syndicate: ["devto"]
draft: false
---

Every part of this series so far has been about the gate saying no. The Stop hook
refuses to let Claude Code finish until Kane CLI has checked the work in a real browser,
and when the check fails, the agent goes back to work.

That raises a question I had to answer in code before I could answer it in prose: how
many times do you send it back? An agent told "try again" will try again forever. It
does not get tired and it does not get embarrassed. Somebody has to decide when the
loop has stopped producing information and started producing noise.

GuardianKane's answer is three. This piece is about what that number does, which
failures bypass it, what the loop remembers between attempts, and the one place in my
own logs where the counter behaved in a way the code does not explain.

## The state machine

![The state machine the Stop hook enforces. PLANNED, IN_PROGRESS, CLAIMED_DONE, KANE_VERIFYING, KANE_VERIFIED in a row. Below: KANE_FAILED routes back to IN_PROGRESS; BLOCKED_NEEDS_HUMAN after the third failure or one case of test tampering; kane-cli exit 2 or 3 leaves state untouched.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002791/portfolio/dispatches/agents-lie/diagram-state-machine.png)

The cap lives in two constants at the top of `.claude/hooks/guardian-kane-stop.js`:

```js
const STALE_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
```

Every gate that can fail a task follows the same shape. Increment the task's
`attempts`, and if it is still under three, set `KANE_FAILED` and deny the stop with a
reason. On the third, set `BLOCKED_NEEDS_HUMAN` and allow the stop with a message
instead. Here is the scripted-test branch:

```js
claimed.attempts += 1;
// ...
if (claimed.attempts < MAX_ATTEMPTS) {
  claimed.state = 'KANE_FAILED';
  return { decision: 'deny', permissionDecisionReason: `T-${claimed.id} failed verification (attempt ${claimed.attempts}/${MAX_ATTEMPTS}). Summary: ${remark}. Reason: ${reason}. Flip T-${claimed.id} to IN_PROGRESS first, then fix and re-claim done.${testMemoryNote}` };
}
claimed.state = 'BLOCKED_NEEDS_HUMAN';
logLine(claimed.id, `-> BLOCKED_NEEDS_HUMAN after ${MAX_ATTEMPTS} failures.`);
return { decision: 'allow', systemMessage: `GuardianKane: T-${claimed.id} failed ${MAX_ATTEMPTS} times, needs human review.` };
```

Two details in that shape matter more than the number.

**`KANE_FAILED` always routes back to `IN_PROGRESS`.** Every denial ends with "Flip
T-x to IN_PROGRESS first". There is no edge from a failed verification back to
`CLAIMED_DONE`. The agent cannot re-assert done on the same code; it has to reopen the
task, which in practice means touching the code again.

**Escalation is an allow, not a deny.** When the hook gives up, it lets the session
stop. That sounds backwards until you picture the alternative: a deny with no retries
left is an instruction to keep going with nothing new to say. The allow ends the
session and leaves a task sitting in `BLOCKED_NEEDS_HUMAN` where the dashboard's stuck
tasks panel picks it up.

## One counter, four gates

The same `attempts` field is shared by every gate that can fail a task: the secret
scan, the per-AC evidence check, the scripted test replay, and the defect sweep. Two
test failures and then a leaked key is three strikes.

That is a deliberate choice, and I think the right one, since the question the counter
answers is "has the agent had enough chances on this task", not "has it failed this
specific check enough". But reading the code for this piece I noticed a side effect:
the escalation message names only the gate that fired last. A task that failed two
replays and then a secret scan ends with "failed the secret scan 3 times", which is
not what happened. The activity log has the full sequence, so nothing is lost, but the
one-line summary a human reads first is wrong in that case. I have not seen it happen
in a logged run; I found it in the code.

## What skips the queue

Two outcomes do not use the three-strike cadence at all.

**Test tampering escalates immediately.** Before any browser run, the hook compares the
task's test file against the previous attempt. If an `@verifies` assertion disappeared
for an acceptance criterion that is unchanged in Kane's graph, that is not a normal
fix, it is a test being weakened to pass. The branch sets `BLOCKED_NEEDS_HUMAN` on the
first occurrence:

```js
logLine(claimed.id, `TEST TAMPERING DETECTED ... -> BLOCKED_NEEDS_HUMAN.`);
```

The reasoning is that retries are for honest mistakes. An agent that deleted the
assertion it could not satisfy will, given another try, find another assertion to
delete.

**Infra errors never count.** When `kane-cli` exits 2 (infra or auth) or 3 (timeout),
the hook logs "state unchanged" and allows the stop with a warning. It does not
increment `attempts`. Part 2 covered why: the verifier fails more often than the app,
and a counter that charged the agent for Kane's bad hour would escalate working
code.

A crashed verification gets its own rule too. A task stuck in `KANE_VERIFYING` for more
than five minutes is reset to `IN_PROGRESS` without a strike, on the theory that a run
that never reported has not judged anything.

## The secret scan

The secret scan is the cheapest gate and runs before any browser. It looks at the
task's scoped diff for known key formats, plus one generic pattern:

```js
const GENERIC_ASSIGNMENT_RE = /\b(api[_-]?key|secret|token|password|passwd|credential)\s*[:=]\s*['"]([^'"]{20,})['"]/i;
```

A match only counts if the value is at least 20 characters, is not on a placeholder
denylist (`changeme`, `example`, `your_` and a few others), and clears an entropy
threshold of 3.5. When it fires, the finding reads like
`server.js: high-entropy value assigned to "secret"`.

That exact finding is in the ecommerce demo's log, below.

## The log where it escalated

The ecommerce demo repo ships with its real history, so its dashboard shows what
happened rather than a clean replay. Here is the Kane activity tab, newest at the top:

![Kane activity log, newest first. T0 sweep found an issue at attempt 1 of 3, then a secret scan failure at attempt 1 of 3 on server.js, then sweep failures at attempts 2 and 3, then BLOCKED_NEEDS_HUMAN after 3 sweep failures. About an hour and a half later T0 is swept again and reaches KANE_VERIFIED. Above that, T1's scripted batch fails three times, the first with the reason all members passed.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002792/portfolio/dispatches/agents-lie/dash-activity-escalation.png)

Reading the T0 rows from the bottom up:

| Time | Event |
|---|---|
| 20:15:30 | sweep FOUND ISSUE (attempt 1/3): (no summary) |
| 20:27:58 | SECRET SCAN FAILED (attempt 1/3): server.js, high-entropy value assigned to "secret" |
| 20:29:56 | sweep FOUND ISSUE (attempt 2/3): (no summary) |
| 20:30:23 | sweep FOUND ISSUE (attempt 3/3): (no summary) |
| 20:30:23 | BLOCKED_NEEDS_HUMAN after 3 sweep failures |
| 22:11:02 | sweep found no issues, KANE_VERIFIED |

This is the escalation working as designed, and it is also the log that taught me the
most, for three reasons.

**The counter went backwards.** The first sweep failure is attempt 1. Twelve minutes
later the secret scan failure is also attempt 1. The hook only ever increments
`attempts`; there is no line in the hook or in `lib/` that sets it back to zero. The
counter lives in the task tracker, a YAML block in a markdown file that the agent also
edits, because the agent is the one who flips tasks to `IN_PROGRESS` and
`CLAIMED_DONE`. Nothing in the hooks guards that field. I do not have data on what
reset it in this run. The log only shows that it was reset.

That is the most important finding in this piece. Part 2 describes the rule that only
the hook writes `KANE_*` states. It is a rule the agent is told, not one the file
system enforces, and the same is true of the retry budget. A cap the capped party can
edit is a suggestion. The fix is to keep `attempts` and the verification states in a
file only the hook writes, and treat the tracker as a view.

**The last two sweeps were not a browser looking at a page.** Attempt 3 started at
20:30:21 and reported an issue at 20:30:23. Two seconds. Attempt 2 took thirty-one.
Neither carried a summary. A defect sweep drives a real browser against the running app;
a two-second verdict with no summary is not evidence about the app. I do not have data
on what the sweep saw. What I can say is that the one escalation I have on screen was
reached mostly on sweep verdicts with nothing behind them, which is the part 5 lesson
again: the verifier is a component, and it fails.

**The human step is invisible.** After the escalation, T0 sits blocked for about an
hour and a half and then comes back with two more sweeps, the second clean. Whatever
happened in between (a fix, a restart, a tracker edit) is not in the activity log,
because the log only records what the hook does. For an audit trail, the most
consequential step, a person deciding to reopen a blocked task, is exactly the one it
cannot see.

Above T0 in the same screenshot, T1's batch fails three times. The first failure's
reason is "all members passed" on a batch that reports 2/3 passed, the mismatch from
part 2. The second and third name the add-one-unit test specifically. The demo's README
says task T5 later failed its checkout test three times with three different concrete
reasons before escalating; that part of the log is not in the screenshots I have here.

## And when it clears

The same demo, a few hours later, from the other direction:

![Kane activity log, newest first. T1 fails the per-AC evidence check at attempt 1 of 3 because seven claimed acceptance criteria have no matching evidence pack, even though its batch reported 3 of 3 passed. The batch is re-run, passes 3 of 3, the sweep is clean and T1 reaches KANE_VERIFIED. T2 fails once on a 3 of 4 batch, then passes 4 of 4 twice and reaches KANE_VERIFIED, and the log ends with all tasks KANE_VERIFIED, build complete.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002795/portfolio/dispatches/agents-lie/dash-activity-verified.png)

The line I care about is T1 at 23:53:35. The scripted batch passed, 3/3. The per-AC
evidence check then failed it anyway: seven claimed acceptance criteria across the
three test files had no matching evidence pack. An aggregate pass is not proof of
each criterion, and the gate treats it that way. That cost one strike, not an
escalation. The batch was re-run at 00:01, passed 3/3 with evidence, the sweep came
back clean, and T1 was verified. At 00:31 the log reads "all tasks KANE_VERIFIED.
Build complete."

This is what I want most strikes to look like: one specific reason, one change, a
pass. The three-strike cap is not there for these. It is there for the loops where the
second and third reasons look like the first.

## What the loop remembers

A retry is only better than the last one if the agent knows something new. GuardianKane
keeps two memories for that.

The first is bug memory, in `lib/bug-memory.js`. Every failure the hook sees is
recorded, "regardless of how it's eventually resolved", and each new failure is
compared against failures from other tasks with a plain Jaccard similarity over word
tokens:

```js
// Jaccard similarity over token sets: cheap, dependency-free, good enough
// to flag "this looks like a bug we've seen before" without an LLM call.
function similarity(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap / new Set([...ta, ...tb]).size;
}
```

At 0.5 or above, the denial gets an extra sentence saying the failure resembles a bug
previously seen on another task, with the similarity score, and asks whether that
earlier fix regressed. The README shows an example of that note; it is illustrative of
the format, not a logged event, and I do not have a logged instance of a regression
note firing to show you here.

The second is knowledge memory: a run history per set of files a verification
touched, pass or fail, with timeouts and infra errors deliberately excluded. The
dashboard's memory graph renders it:

![The GuardianKane memory graph with a node selected: public/styles.css, 15 runs, currently fixed. A list of fails and passes from 29 August to 30 August, one of which carries a note: signed-in header assertion expects wrong email value, family automation_bug, confidence 0.96.](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002800/portfolio/dispatches/agents-lie/dash-memory-history.png)

`styles.css` shows 15 runs, 12 fails and 3 passes, and "currently fixed". Two honest
readings of that panel:

- Those are not 12 failures of a stylesheet. History is keyed by the files a
  verification touched, and a stylesheet is touched by nearly everything. The first
  three fails line up to the second with T1's three batch failures in the activity log
  above. The file's history is a record of the tasks that went through it.
- The one annotated failure is `automation_bug` at 0.96 confidence: the test expected
  the wrong email, not the app showing it. Bug memory stores these too, because it
  records every failure regardless of resolution. It does store the family, so the
  information to tell them apart is there, but the similarity match does not filter on
  it. A later task could be told it resembles a "bug" that was really a broken test.
  Given part 5, I would filter those out of regression notes.

## Why three

I do not have data that three is the right number. I did not run the loop with two or
five and compare, and I have not counted retries across every run. It is a guess, and
the two logs above are the only shape I can point to: T1 cleared after one strike with
a specific reason, and T0 went to three on sweeps that mostly carried no reason at all.
A fourth try on "(no summary)" teaches nobody anything.

What I am more confident about is the structure around the number: honest failures
retry, tampering does not, the verifier's own failures do not count, and the budget
has to live somewhere the agent cannot write. GuardianKane gets the first three right.
The fourth is the next commit.

## The series, in one line each

1. [An agent shipped a broken chart](/dispatches/agent-shipped-a-broken-chart) and I
   built a gate that would not take its word for it.
2. [Wiring Kane CLI into Claude Code](/dispatches/wiring-kane-cli-into-claude-code):
   a Stop hook, a tracker, and exit codes that lie less than summaries.
3. [The requirement nobody wrote](/dispatches/the-requirement-nobody-wrote): the bug
   was in the PRD, and grilling found it.
4. [The experiment where nothing happened](/dispatches/the-experiment-where-nothing-happened):
   a null result, reported as one.
5. [Who verifies the verifier](/dispatches/who-verifies-the-verifier): six test
   failures, zero app bugs.
6. Three strikes, then a human: this one.

The code is public at
[github.com/18Abhinav07/adventures-with-kane](https://github.com/18Abhinav07/adventures-with-kane),
and the ecommerce demo with its unedited history is at
[github.com/18Abhinav07/guardiankane-ecommerce-demo](https://github.com/18Abhinav07/guardiankane-ecommerce-demo).

---

*Part 6 of a six-part series, and the last. Previously: [who verifies the verifier](/dispatches/who-verifies-the-verifier).
Start from the beginning with [the series page](/dispatches/series/your-agent-might-lie).*
