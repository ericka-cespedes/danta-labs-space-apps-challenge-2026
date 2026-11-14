---
name: issue-planner
description: 'Plan execution from a GitHub issue number or URL, then generate docs-local markdown files for the execution plan and detailed, dependency-aware PBIs.'
argument-hint: 'GitHub issue number (for current repo) or full issue URL, optionally followed by planning context notes'
user-invocable: true
disable-model-invocation: false
---

# Issue Planner

Use this skill to transform a GitHub issue into two planning artifacts in `docs-local/`:

1. `issue-{id}-execution-plan.md`
2. `issue-{id}-pbis.md`

This skill must run in planning mode. It does not implement code changes from the issue.

## Plan Mode Protocol (Mandatory)

Before generating any markdown artifacts, follow this exact protocol:

1. Explicitly enter planning mode and state that implementation is out of scope for this run.
2. Build an analysis-first execution outline from the issue details:
   - Problem framing
   - Scope boundaries
   - Constraints
   - Risks and assumptions
   - Verification strategy
3. Validate that the execution outline is dependency-aware and testable.
4. Only after steps 1 to 3 are complete, write the two output files in `docs-local/`.

Plan mode constraints:

- Do not implement feature code.
- Do not propose speculative architecture that is not justified by issue requirements.
- Do not skip dependency analysis before producing PBIs.
- If critical requirements are missing, ask clarifying questions before writing files.

## When To Use

- The user asks to plan implementation work for an issue.
- The user provides a GitHub issue number and wants actionable execution steps.
- The user provides a GitHub issue URL and wants PBIs with dependencies.

## Inputs

Accepted argument formats:

- Issue number only (current repository):
  - `123`
  - `#123`
- Full GitHub issue URL:
  - `https://github.com/<owner>/<repo>/issues/<id>`

Optional trailing context is allowed after the issue reference and can be used as planner guidance.

## Input Normalization Rules

1. Parse the first issue reference from arguments.
2. If the reference is numeric (`123` or `#123`):
   - Use the active repository context.
3. If the reference is a URL:
   - Extract owner, repository, and issue number.
4. Reject unsupported forms (for example PR URLs, malformed paths, or missing ID) and ask for a valid issue number or URL.

## Required Context Gathering

Fetch issue details before planning:

1. Resolve repository coordinates and issue ID from normalized input.
2. Retrieve the issue title, body, labels, assignees, and current state with the GitHub issue tooling.
3. If the issue is inaccessible, report the exact blocker and stop.

## Planning Analysis (Plan Mode)

Analyze the issue requirements and produce a clear execution strategy by extracting:

- Objective and intended outcomes.
- In-scope behaviors and explicit out-of-scope boundaries.
- Constraints (technical, security, compatibility, operational).
- Acceptance criteria and test expectations.
- Risks, assumptions, and unknowns.
- Impacted code areas and likely cross-team dependencies.
- A proposed dependency-respecting implementation order.

If requirements are ambiguous or incomplete, ask clarifying questions before writing files.

For releases or deployments, include them only when explicitly requested.
Inspect the repository's actual branches and delivery process; do not assume
a separate development branch, backend, database, or deployment workflow.

## Output Files

Create or overwrite both files in `docs-local/` using this naming scheme:

- `docs-local/issue-{id}-execution-plan.md`
- `docs-local/issue-{id}-pbis.md`

For issue `123`, expected outputs are:

- `docs-local/issue-123-execution-plan.md`
- `docs-local/issue-123-pbis.md`

## Execution Plan File Contract

Write `issue-{id}-execution-plan.md` with deterministic sections in this order:

1. `# Issue {id}: Execution Plan`
2. `## Source`
   - Issue URL
   - Issue title
3. `## Scope`
   - In scope
   - Out of scope
4. `## Objectives`
5. `## Technical Approach`
6. `## Sequencing Strategy`
7. `## Verification Plan`
8. `## Risks and Mitigations`
9. `## Assumptions and Open Questions`

Guidance:

- Keep steps implementation-oriented and testable.
- Include concrete verification actions (tests, lint, API checks, UX checks as applicable).
- Avoid speculative architecture not justified by the issue.

## PBI File Contract (Detailed)

Write `issue-{id}-pbis.md` with these sections:

1. `# Issue {id}: PBI Breakdown`
2. `## PBIs`
3. `## Dependency Graph`
4. `## Delivery Order`
5. `## Parallelization Notes`
6. `## Capacity and Ownership Notes`

Define each PBI in a detailed, dependency-aware format:

- `### PBI-{nn}: <title>`
- `Objective:` 1 to 2 sentences describing the user or business outcome.
- `Scope:` concrete implementation boundaries for this PBI.
- `Depends on: PBI-xx, PBI-yy` (or `None`)
- `Primary Owner Role:` placeholder role (for example Frontend, Backend, QA, Platform)
- `Estimated Effort:` T-shirt size (`XS`, `S`, `M`, `L`) plus optional rationale
- `Implementation Notes:` key design or integration notes needed to execute safely
- `Acceptance Criteria:`
  - 3 to 7 concrete checkbox items using Markdown task-list format: `- [ ] <criterion>`.
- `Test Strategy:`
  - Required unit/integration/functional checks for this PBI.
- `Risks and Mitigations:`
  - At least one risk and mitigation pair when risk exists; otherwise `None identified`.

Formatting guidance for PBIs:

- Insert a blank line between each section label (Scope, Depends on, Primary Owner Role, Estimated Effort, Implementation Notes, Acceptance Criteria, Test Strategy, Risks and Mitigations) to improve readability and visual separation.

Dependency rules:

- Every dependency must reference an existing PBI ID.
- Do not create circular dependencies.
- Delivery order must be topologically consistent with dependencies.
- Mark PBIs that can run in parallel when dependency-free.
- Keep each PBI independently testable and reviewable.

## Quality Checks Before Finalizing

Validate all of the following before returning:

1. Both markdown files exist in `docs-local/`.
2. Required section headings are present in each file.
3. Every PBI includes owner role and estimated effort.
4. Every PBI includes acceptance criteria, test strategy, and risk notes.
5. Every acceptance criterion is formatted as an unchecked checkbox (`- [ ] ...`).
6. Every PBI section is separated by a blank line for readability.
7. Every dependency reference points to a defined PBI.
8. No circular dependency appears in the dependency graph.
9. File names match the normalized issue ID.

## Failure Handling

- If issue retrieval fails: report reason and stop.
- If repository mismatch prevents access: report mismatch and stop.
- If issue body is too sparse: ask user clarifying questions before generating artifacts.
- If planning context conflicts with issue requirements: prioritize explicit issue requirements and note conflict in assumptions.

## Usage Examples

- `issue-planner 456`
- `issue-planner #456`
- `issue-planner https://github.com/ericka-cespedes/danta-labs-space-apps-challenge-2026/issues/456`
- `issue-planner 456 focus on smallest safe rollout`

## Completion Behavior

When complete, provide a short summary that includes:

- Normalized issue reference.
- Paths of both generated files.
- Any unresolved assumptions requiring follow-up.
