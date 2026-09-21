---
title: "My Agent Shipped a Broken Chart and Told Me It Was Done"
date: "2026-09-21"
summary: "Two builds, one PRD. One rendered a clean performance chart. The other rendered the same line twice, overlapping, and reported the task complete. The difference was not the model."
tags: ["AI Agents", "Testing", "Verification", "Claude Code"]
project: "guardiankane"
kind: "teardown"
series: "your-agent-might-lie"
seriesPart: 1
cover: "https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002775/portfolio/dispatches/agents-lie/cover-1.png"
coverAlt: "Part 01 cover: a line chart drawn twice, slightly offset, under the title My agent shipped a broken chart and told me it was done"
syndicate: ["devto"]
draft: false
---

The chart looked fine in the code.

The data pipeline was correct. The chart library call had the right shape. Every prop
was passed, every array was populated, and nothing about the component would have
looked suspicious in thirty seconds of review. If you had put that diff
in front of me cold, I would have approved it.

Then I opened the page. The performance chart was rendering the same series twice, two
overlapping traces at slightly different weights, producing a smeared, doubled line
that no one would ship on purpose.

The agent that wrote it had already marked the task done.

## The setup

I was running four paired experiments for a hackathon build. Each pair is the same
PRD given to two builds: one unassisted, one wrapped in a verification gate I had
written called GuardianKane. The pairs were a todo app, a room booking widget, a
higher-fidelity booking studio, and ORBITAL, a dense single-page institutional
portfolio dashboard with twelve or so interactive subsystems.

ORBITAL is where the interesting things happen, because it is the only one of the four
with enough visual and interactional density to have somewhere to hide.

The gate itself is simple to describe. It hooks Claude Code's `Stop` event. When a task
is marked `CLAIMED_DONE`, the hook refuses to let the session stop until it has driven
a real Chrome instance over CDP against the running dev server and replayed a generated
test for that task. If the test fails, the task goes back to `IN_PROGRESS` and the agent
has to fix actual code. It does not get to stop by asserting that it is finished.

The word "real" is doing a lot of work in that paragraph, and it is the entire point.

## What each build produced

`orbital-kane` rendered one clean solid trend line plus a visually distinct dashed
benchmark comparison, which is what the PRD asked for.

![The gated build's portfolio performance chart: a single clean solid trend line with a separate dashed benchmark line beneath it](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1789917425/portfolio/dispatches/broken-chart/orbital-kane-1.png)

*`orbital-kane`. One series, one line.*

`orbital-baseline` rendered two overlapping, differently weighted traces on the same
series at once.

![The unassisted build's chart: the same data series drawn twice at different stroke weights, producing a visibly smeared and doubled line](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1789917428/portfolio/dispatches/broken-chart/orbital-baseline-2.png)

*`orbital-baseline`. The same series, drawn twice. This build reported the task complete.*

This is not a subjective styling disagreement. It is a defect that is completely
invisible from reading the component, because nothing in the component is wrong in a
way that reading catches. The data flows correctly. The library call is well formed.
The bug only exists at the moment of render, which means the only way to find it is for
something to actually look at the rendered page.

A human would have caught this in about one second. No human was looking, because the
agent said it was done, and "done" was a claim nobody had any mechanism to check.

## The part I did not expect: the sweep, and how little it had to do

The gate runs two independent checks per task, and I assumed going in that the scripted
one was the valuable half.

The first check is the scripted replay: the generated test file executed exactly as
authored, exit code mapped straight into the hook's decision table. This is the part
that feels rigorous. It is deterministic, it is repeatable, and it is what you would
build first.

The second check is a defect sweep. It is an unscripted `kane-cli run` that opens the
live app, reads the task's PRD section, and is asked to report visual defects, layout
problems, missing elements, or anything that does not match the requirement. I built
it almost as an afterthought, and I was mildly embarrassed by how fuzzy it was.

Here is what the append-only activity log for the ORBITAL build actually records.
Twelve tasks, all twelve reached `KANE_VERIFIED`. The sweep flagged something exactly
once, on T7, the alerts panel. Both scripted tests for T7 had just passed. Those tests
covered expand and switch behavior; they asserted nothing about layout. The sweep
failed the task anyway and sent it back to `IN_PROGRESS`. About 43 minutes later the
tests passed again and the sweep came back clean.

I have to be precise about what I do not know. That log line carries no summary text,
so I cannot tell you what the sweep saw. The alerts panel is the same panel the
unassisted build got structurally wrong, which is a tempting story. I have no data
that connects the two, so I am not telling it.

What I can say is that one catch in twelve tasks is a small number, and it is the right
kind of small. It was the only failure in the whole build that was a real problem with
the app. Every other failure turned out to be something else, which is the subject of
the caveat below and of part 5 of this series.

The pattern underneath: a scripted test can only ever check what you thought to
assert. The defects that ship are, almost by definition, the ones nobody thought to
assert. If your entire verification strategy is assertions you wrote in advance, you
have built a system that cannot catch the thing most likely to hurt you.

## The other two ORBITAL findings

The doubled chart got the attention, but two more showed up in the same comparison.

The PRD specifies a single-column, full-width, vertically stacked alert list with
single-expand behavior. `orbital-kane` matches that. `orbital-baseline` drifted into a
compact two-column side-by-side layout instead. That is a structural deviation from a
documented requirement, not a cosmetic variation, and again it is invisible from the
code: a grid class is not wrong-looking in a diff.

![The gated build's alerts panel: full-width alert cards stacked vertically, one expanded with its action visible](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002810/portfolio/dispatches/agents-lie/orbital-kane-3.png)

*`orbital-kane`. Full width, stacked, one expanded. What the PRD asks for.*

![The unassisted build's alerts panel: alert cards squeezed into two columns side by side, with uneven gaps against the panels below](https://res.cloudinary.com/dj57qnyzd/image/upload/f_auto,q_auto/v1790002808/portfolio/dispatches/agents-lie/orbital-baseline-1.png)

*`orbital-baseline`. Two columns, and the gaps do not match the panels beneath it.*

The same baseline screenshot also shows uneven gaps between panel groups. The space
around the alerts block does not match the space around the holdings and risk cards
directly beneath it in the same viewport.

Three defects, one build, all of them the specific flavor of wrong that looks right at
a glance.

## What I actually take from this

The naive reading of this result is "agents are unreliable, add tests." That reading is
wrong, or at least useless, because it was already the advice before I started.

The more precise reading is that the failure was never in the code generation. Claude
wrote a chart component that was, structurally, fine. The failure was in the
self-report. An agent saying "done" is an assertion with no evidence attached, and I had
built an entire workflow that treated that assertion as a state transition.

I also have to be careful about what the gated build proves. Its chart was right, but
the activity log does not show the gate catching a doubled chart and forcing a fix. The
failures on the chart task were all traced to the test automation. So I cannot claim
the gate fixed the chart. The gated build went through a grilling pass over the PRD,
twelve tasks each scoped to a PRD section, and a check at every stop. Which of those
made the difference, one pair of builds cannot tell me.

What I can claim is narrower. In the gated build, nothing reached "done" on the agent's
word. Every task had to pass a browser check or a human had to sign off with evidence
attached. In the unassisted build, "done" was a sentence, and the sentence was wrong.
The claim stopped being load-bearing, and that is the property I care about.

There is a version of this that is just CI, and I want to be honest that for a lot of
projects, CI is enough. What CI does not give you is a check that runs inside the agent's
own loop, before it stops, while it still has the context to fix what it broke. By the
time CI goes red, the session is over and the context is gone. The gate fires while the
agent is still standing there.

## The caveat I have to include

Running this honestly meant accepting that my own verifier is also fallible, and that
its failures look exactly like real defects.

Six ORBITAL tasks (T2, T3, T4, T9, T10, T11) failed their scripted tests and needed a
human-reviewed override before they could reach `KANE_VERIFIED`. In all six,
`kane-cli`'s own bug triage came back `confirmed: false`, family `automation_bug`. A
test script missing a hover step. A stale replay baseline after a legitimate popover
fix. A redundant final re-check that stalled after the real action had already passed.
None of the six was a defect in the app.

I re-inspected every raw `failed` result against the verifier's own `verdict.confirmed`,
`family`, and `category` fields rather than trusting the exit code. If I had not done
that, I would be writing a much more impressive post right now, with seven caught
defects instead of one, and six of them would be my own tooling failing while I called
it a finding.

A verifier you do not verify is just a second thing making unchecked claims.

---

*Built during the [TestMuAI](https://testmuai.com) Kane CLI hackathon, where it placed 2nd. The four paired
experiments, the full evidence record, and the activity log quoted above are in the
[repo](https://github.com/18Abhinav07/adventures-with-kane). Next in this series:
[how I wired Kane CLI into Claude Code](/dispatches/wiring-kane-cli-into-claude-code).*
