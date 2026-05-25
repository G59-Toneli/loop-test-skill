# cso-rules

## Description standard

Frontmatter `description` must:
- start with `Use when...`
- describe trigger conditions only
- avoid summarizing workflow
- stay third-person and specific

Good:
- `Use when a feature, bugfix, or refactor needs deterministic end-to-end validation through iterative fix-test-fix execution.`

Bad:
- `Use when validating changes by choosing method, creating scenarios, and iterating through failures.`

## Naming standard

- use lowercase letters, numbers, hyphens
- prefer action-oriented names
- avoid vague or overloaded labels

## Keyword coverage

Include search-friendly terms users and agents will query:
- symptoms: flaky, nondeterministic, race condition
- artifacts: checklist, regression, escalation
- testing context: unit, integration, e2e

## Token efficiency

- keep `SKILL.md` focused on contract + execution flow
- move deep detail to companion docs
- avoid duplicated guidance across files

## Cross-reference rule

When another skill is mandatory, reference explicitly:
- `REQUIRED SUB-SKILL: <skill-name>`

Avoid force-loading unrelated files or long inline references.