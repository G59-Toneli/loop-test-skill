# loop-test

Public reusable skill for rigorous validation loops after implementing a feature, bugfix, or refactor.

## What it does

- picks the lowest-cost test level that can still prove behavior
- generates a scenario matrix (common + edge + failure + security)
- asks the user to validate scenarios before execution
- builds a scenario checklist and runs tests sequentially
- iterates with root-cause fixes until scenarios pass or escalation gates trigger

## Core behavior

1. Analyze change scope and select test strategy.
2. Propose scenarios in chat with options to approve/add/remove/edit.
3. Create checklist with explicit status per scenario.
4. Execute fix->test->fix per scenario.
5. Publish final structured report with coverage and open escalations.

## Compatibility

- Codex personal skills: `~/.agents/skills/`
- Claude Code personal skills: `~/.claude/skills/`

## Privacy and safety

- no private credentials, tokens, or personal data in skill content
- use placeholders for sensitive values
- do not reduce assertions or mask flaky behavior with shortcuts

## Usage hint

Use when you want deterministic validation with clear progress tracking, not for a single isolated unit test.