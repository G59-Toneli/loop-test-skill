# cso-rules

## Policy levels

- REQUIRED: mandatory for publish-ready quality.
- RECOMMENDED: default unless project context justifies deviation.
- OPTIONAL: only when it adds concrete value.

## Description standard

Frontmatter `description` is REQUIRED to:
- start with `Use when...`
- describe trigger conditions only
- avoid summarizing workflow
- stay third-person and specific

Good:
- `Use when a feature, bugfix, or refactor needs deterministic end-to-end validation through iterative fix-test-fix execution.`

Bad:
- `Use when validating changes by choosing method, creating scenarios, and iterating through failures.`

## Naming standard

REQUIRED:
- use lowercase letters, numbers, hyphens
- prefer action-oriented names

RECOMMENDED:
- avoid vague or overloaded labels

## Keyword coverage

RECOMMENDED search terms:
- symptoms: flaky, nondeterministic, race condition
- artifacts: checklist, regression, escalation
- testing context: unit, integration, e2e

## Token efficiency

REQUIRED:
- keep `SKILL.md` focused on contract + execution flow
- avoid duplicated guidance across files

RECOMMENDED:
- move deep detail to companion docs

## Cross-reference rule

When another skill is mandatory, write explicitly:
- `REQUIRED SUB-SKILL: <skill-name>`

RECOMMENDED: avoid force-loading unrelated files or long inline references.