# loop-test

Public skill for deterministic validation of feature, bugfix, and refactor changes through a **fix -> test -> fix** loop, with scenario control, evidence, and final regression.

## What this skill solves

- Prevents false green results (tests passing while bugs are masked).
- Enforces root-cause fixes instead of cosmetic patches.
- Keeps execution traceable with a scenario checklist and explicit states.
- Standardizes escalation when real blockers happen (budget, dependencies, product decision).

## When to use

Use this skill when a change is already implemented and you need rigorous behavior validation before merge/release:

- new feature with regression risk
- bugfix with flaky/non-deterministic history
- refactor that may break an external contract
- explicit request for looped validation (`/loop-test`, "validate this", "test until stable")

## When **not** to use

- single isolated unit assertion with no multi-scenario risk
- exploratory debugging without an acceptance contract
- purely visual/text updates with no behavior change
- cases with no testable hypothesis or no runnable validation path

## Mandatory flow (summary)

1. Understand change scope.
2. Select the cheapest test level that can prove behavior.
3. Propose a scenario matrix with stable `Scenario ID` and explicit failure signal.
4. Request explicit user approval for the matrix.
5. Execute scenarios sequentially with tracked states.
6. On failure: diagnose root cause, fix, rerun the same scenario.
7. After all approved scenarios pass: run full regression.
8. Deliver a structured `loop-test report`.

## Definition of done (must all pass)

- RED captured: at least one approved scenario fails before fix.
- GREEN validated: same scenario passes after fix.
- Root cause closed: fix explains causal correction, not symptom masking.
- Scenario closure: no approved scenario left in `pending`/`running`.
- Final regression executed after scenario pass closure.

## Repository structure

- `SKILL.md`: main skill contract and mandatory execution flow.
- `testing-playbook.md`: test-level ladder, escalation gates, anti-gaming rules.
- `loop-templates.md`: execution templates (RED, REFACTOR, checklist).
- `cso-rules.md`: description/naming standards and token-efficiency rules.
- `SKILL_EVOLUTION.md`: skill evolution history.

## Install this skill in Code Agent (Codex)

### 1) Create the skill directory

On the target user machine:

```bash
mkdir -p ~/.agents/skills/loop-test
```

### 2) Copy the skill files

At minimum, copy `SKILL.md`. It is recommended to include companion docs too:

- `testing-playbook.md`
- `loop-templates.md`
- `cso-rules.md`

Example (replace `<REPO_PATH>`):

```bash
cp <REPO_PATH>/SKILL.md ~/.agents/skills/loop-test/SKILL.md
cp <REPO_PATH>/testing-playbook.md ~/.agents/skills/loop-test/testing-playbook.md
cp <REPO_PATH>/loop-templates.md ~/.agents/skills/loop-test/loop-templates.md
cp <REPO_PATH>/cso-rules.md ~/.agents/skills/loop-test/cso-rules.md
```

### 3) Verify installation

```bash
ls ~/.agents/skills/loop-test
```

You should see `SKILL.md` and the companion docs.

### 4) Use it in Code Agent

Invoke the skill by name in the agent prompt:

- `$loop-test`
- or an explicit equivalent request (e.g. "use loop-test to validate this bugfix")

## Compatibility

- Codex / Code Agent: `~/.agents/skills/<skill-name>/SKILL.md`
- Claude Code: `~/.claude/skills/<skill-name>/SKILL.md`

## Security and privacy

- Never expose secrets/tokens/PII in logs, prompts, screenshots, or examples.
- Always use placeholders (`<API_TOKEN>`, `<TEST_ACCOUNT_EMAIL>`, `<PROJECT_PATH>`).
- Never test against real customer channels without isolation and explicit approval.
