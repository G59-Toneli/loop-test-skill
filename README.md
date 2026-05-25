# loop-test

Public skill for deterministic validation of feature, bugfix, and refactor changes through a **fix -> test -> fix** loop, with scenario control, anti-flaky checks, and decision-ready output.

## Quick install

```bash
npm install -g loop-test-skill
```

```bash
loop-test-skill --agent both --force
```

Use in agent prompt:
- `$loop-test`
- `/loop-test`

## What this skill solves

- Prevents false green results (tests passing while bugs are masked).
- Enforces root-cause fixes instead of cosmetic patches.
- Keeps execution traceable with a scenario matrix and explicit states.
- Standardizes escalation when real blockers happen (budget, dependencies, product decision).
- Returns a merge decision users can act on: `merge seguro | merge com risco | nao mergear`.

## Core user features

- `/loop-test`: single-entry prompt-first validation flow with minimal required input.
- Pre-Test Grill: mandatory domain-by-domain risk interrogation before matrix generation.
- Automatic test-level selection: chooses the cheapest level that can prove behavior.
- Risk-aware scenario matrix: prioritizes high-value scenarios by change type and risk.
- Execution profiles: `rapido`, `padrao`, `paranoico`.
- Anti-flaky policy: adaptive quorum (`padrao=2/2`, `paranoico=3/3`) for unstable scenarios.
- Optional regression memory (`loop-memory.md`) for cross-session reuse.
- Structured final report with decision, evidence, residual risks, and regression commands.

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

1. Run `/loop-test` with change summary and change type.
2. Classify risk and select profile (`rapido|padrao|paranoico`).
3. Run Pre-Test Grill and produce `grill summary + risk map`.
4. Approve grill output (interactive) or lock assumptions with risk impact (delegated).
5. Select the cheapest test level that can prove behavior.
6. Propose scenario matrix with stable `Scenario ID` and explicit failure signal.
7. Request explicit matrix approval (interactive) or lock criteria/scope (delegated).
8. Execute scenarios sequentially with tracked states.
9. On failure: diagnose root cause, fix, rerun the same scenario.
10. Apply anti-flaky quorum when instability appears.
11. Run risk-tier regression (`targeted|suite|full`) after scenario closure.
12. Deliver `loop-test report` with decision state.

## Definition of done (must all pass)

- RED captured: at least one approved scenario fails before fix.
- GREEN validated: same scenario passes after fix.
- Root cause closed: fix explains causal correction, not symptom masking.
- Scenario closure: no approved scenario left in `pending`/`running`.
- Final risk-tier regression executed after scenario pass closure.
- Decision state emitted: `merge seguro | merge com risco | nao mergear`.
- Pre-Test Grill gate passed before matrix generation.

## Repository structure

- `SKILL.md`: main skill contract and mandatory execution flow.
- `testing-playbook.md`: pre-test grill policy, test-level ladder, escalation gates, anti-gaming rules.
- `loop-templates.md`: grill summary, scenario matrix, and execution templates (RED, REFACTOR, checklist).
- `loop-memory.md`: optional memory schema for cross-session non-regression scenarios.
- `cso-rules.md`: description/naming standards and token-efficiency rules.
- `SKILL_VALIDATION.md`: empirical baseline vs compliance validation log.

## Install alternatives

Run directly with npx (without global install):

```bash
npx loop-test-skill
```

Common variants:

```bash
# install for both Codex and Claude Code
npx loop-test-skill --agent both

# install for Claude Code only
npx loop-test-skill --agent claude

# preview actions without writing files
npx loop-test-skill --agent both --dry-run

# overwrite existing files
npx loop-test-skill --force
```

By default:
- Codex target: `~/.agents/skills/loop-test`
- Claude Code target: `~/.claude/skills/loop-test`

## Manual install (fallback)

Install this skill in Code Agent (Codex):

### 1) Create the skill directory

On the target user machine:

```bash
mkdir -p ~/.agents/skills/loop-test
```

### 2) Copy the skill files

At minimum, copy `SKILL.md`. It is recommended to include companion docs too:

- `testing-playbook.md`
- `loop-templates.md`
- `loop-memory.md`
- `cso-rules.md`

Example (replace `<REPO_PATH>`):

```bash
cp <REPO_PATH>/SKILL.md ~/.agents/skills/loop-test/SKILL.md
cp <REPO_PATH>/testing-playbook.md ~/.agents/skills/loop-test/testing-playbook.md
cp <REPO_PATH>/loop-templates.md ~/.agents/skills/loop-test/loop-templates.md
cp <REPO_PATH>/loop-memory.md ~/.agents/skills/loop-test/loop-memory.md
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
- `/loop-test`
- `/loop-test auto` (legacy alias)
- or an explicit equivalent request (e.g. "use loop-test to validate this bugfix")

## Compatibility

- Codex / Code Agent: `~/.agents/skills/<skill-name>/SKILL.md`
- Claude Code: `~/.claude/skills/<skill-name>/SKILL.md`

## Security and privacy

- Never expose secrets/tokens/PII in logs, prompts, screenshots, or examples.
- Always use placeholders (`<API_TOKEN>`, `<TEST_ACCOUNT_EMAIL>`, `<PROJECT_PATH>`).
- Never test against real customer channels without isolation and explicit approval.
