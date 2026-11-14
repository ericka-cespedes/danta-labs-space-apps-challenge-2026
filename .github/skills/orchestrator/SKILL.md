---
name: orchestrator
description: 'Verify whether dependency-aware PBIs have remaining implementation gaps, stop with evidence when the scope is already satisfied, or coordinate implementation in waves with developer agents, cascading blockers, documentation, and QA.'
argument-hint: 'Optional: PBI file path in docs-local/, inline PBI markdown, or empty to list available PBI files and choose'
user-invocable: true
disable-model-invocation: false
---

# Orchestrator

Use this skill to coordinate implementation of a list of PBIs using developer agents.

This skill is orchestration-only. It does not implement code directly.

## Hard Rules (Mandatory)

- Never read source files, run builds, or write code directly in the orchestrator.
- Delegate all implementation and validation work to developer agents.
- Never attempt to fix blockers yourself.
- Always complete the verifier preflight before orchestration. Print the wave plan before dispatching any implementation agent.
- Always pass full PBI text to developer agents, never just PBI IDs.
- Always pass collected outputs from completed PBIs to their dependents.
- On `BLOCKED`, cascade `SKIPPED` to all transitive dependents in the DAG.
- Keep harness context lean by dispatching one developer agent at a time within each wave.

## Input Modes

Accept one of these forms:

1. File path input

- A path to a PBI file under `docs-local/`.
- File name must contain `PBI` (case-insensitive).

2. Inline PBI content

- Raw markdown text containing one or more PBIs.

3. Empty input

- List available files in `docs-local/` whose names contain `PBI`.
- Ask the user which file(s) to run.

## Verifier Preflight (Mandatory)

After resolving the input to complete PBI markdown, but before parsing dependencies, printing a wave plan, or dispatching implementation agents, spawn the `Verifier` agent.

Pass the agent:

- The complete PBI markdown (for file input, read and pass the selected file contents).
- Any user-provided implementation context or constraints.

Use `.github/agents/verifier.agent.md` as the source of truth for the verifier's inspection process and status-and-evidence response format. The orchestrator itself must not inspect source files.

Use the verifier's status to decide what happens next:

- `NO_GAP`: report that no implementation gap was found, include the verifier's evidence, and stop immediately. Do not parse or schedule PBIs, dispatch implementation agents, run documentation or QA passes, or make changes.
- `GAP_FOUND`: report the verifier's evidence, completed behavior to preserve, and specific remaining gaps, then continue with normal PBI parsing and orchestration. Use the verifier report as preflight evidence only; do not narrow the supplied PBI scope. Pass the complete PBI text and normal dependency context to each PBI Implementer.
- `BLOCKED`, missing, or malformed status: stop and report the verifier's evidence or reason verification could not proceed. Do not begin implementation.

## PBI Parsing Contract

Parse PBIs from markdown sections using heading patterns:

- `## PBI-N: <title>`
- `### PBI-N: <title>`
- `## PBI-N <title>`
- `### PBI-N <title>`

Normalize IDs to `PBI-N` preserving numeric suffix.

Extract for each PBI:

- `id`: `PBI-N`
- `title`
- `fullText`: full markdown block for this PBI section
- `dependsOn`: parsed from `Depends on:` line

Dependency parsing rules:

- `Depends on: None` => no dependencies.
- Otherwise parse comma-separated IDs (`PBI-1`, `PBI-02`, etc.).
- Normalize dependency IDs to the same `PBI-N` canonical form.
- Validate all dependencies reference known PBIs.
- If invalid dependency references exist, stop and report parse error.

## Dependency DAG and Wave Plan

1. Build DAG from `dependsOn` edges.
2. Detect cycle; if found, stop and report cycle path.
3. Compute execution waves via topological layering.
4. Print wave plan before dispatching any implementation agent.

Required wave header format:

```text
=== Wave N of T — K PBIs ===
```

- `N`: 1-based wave number.
- `T`: total wave count.
- `K`: number of PBIs in this wave after excluding pre-marked `SKIPPED` PBIs.

## Developer Agent Dispatch Protocol

Within each wave, process PBIs sequentially.

Before each dispatch, print exactly:

```text
→ [wave N, PBI M/K] Dispatching PBI-X: <PBI title>
```

Then spawn one developer agent for that PBI sequentially (no true background execution).

Developer agent to use:

- `PBI Implementer`

The dispatch payload must include:

- Full developer instructions from this file (section: `Developer Agent Instructions`).
- Full text of this PBI.
- Context outputs from all completed dependency PBIs.
- Current learnings log accumulated so far.

## Developer Completion Handling

When the developer agent finishes, immediately print one result line before any additional processing:

- Done:

```text
✓ [wave N, PBI M/K] PBI-X done
```

- Blocked:

```text
✗ [wave N, PBI M/K] PBI-X BLOCKED — <blocker description>
```

Then read and parse the developer status block using the contract below.

### Developer Status Block Contract (Required)

Each developer agent response must include exactly one status block for parsing, and it may append a human-readable summary after the status block:

```text
STATUS: DONE | BLOCKED
PBI: PBI-X
Changed files:
- <path>
Outputs for dependents:
- <key>: <value>
Manual verification items:
- <item>
Learnings:
- <learning or none>
Blocker:
- <description or none>
```

Interpretation:

- `DONE`
  - Record changed files.
  - Record outputs for dependents.
  - Record manual verification items.
  - Record each non-`none` learning bullet into running learnings log, tagged by PBI ID.
  - If source came from file: update that PBI section status in file (see next section).

- `BLOCKED`
  - Record blocker reason.
  - Walk DAG forward from blocked node and mark all transitive dependents as `SKIPPED`.
  - Continue processing only unaffected PBIs.

## Updating PBI File Status (File Mode Only)

If PBIs came from a file, immediately update the file after each `DONE` result.

Update rule:

- Insert a new line directly after the PBI heading line:
  - `**status: done**`

Heading matching is exact to this PBI section heading line as parsed.

Do not add duplicate status lines if already present.

## Wave Summary (Required)

After finishing each wave, print:

```text
=== Wave N complete ===
DONE:    PBI-X, PBI-Y
BLOCKED: PBI-Z — <blocker description>
SKIPPED: PBI-W (depends on PBI-Z)
```

Rules:

- Always print all three lines.
- Use `None` when a category is empty.
- Proceed to next wave excluding `SKIPPED` PBIs.

## QA Pass

Always run QA after all waves, regardless of done/blocked/skipped mix.

Spawn `Quality Assurance` with prompt containing:

- Full QA instructions from this file (section: `QA Agent Instructions`).
- Full text of every dispatched PBI (DONE, BLOCKED, SKIPPED).
- Status blocks from every developer agent execution.

## QA Issue Resolution (Interactive)

After the QA agent completes, perform the following steps in order:

### Step 1 — Show QA report only

Print the full QA report verbatim. Do not print any other final-report sections yet.

### Step 2 — Parse QA findings

Extract every distinct finding from the QA report. A finding is any numbered or bulleted issue entry that includes a severity label (Critical, High, Medium, Low) and a description. Assign each finding a short identifier (e.g. `QA-1`, `QA-2`, …) for use in the interactive prompt.

If the QA report contains **no findings**, skip Steps 3–5 and proceed to the Final Documentation and Testing-Plan Pass.

### Step 3 — Ask user which issues to resolve

Use `ask_user` to present an interactive multiple-choice prompt:

- Question: `Which QA issues should be resolved immediately?`
- Build the choices list dynamically:
  1. First choice (default): `All` — resolves every finding.
  2. One choice per finding: `[QA-N] <severity> — <short description>`.
  3. Final choice: `None — skip fixes and continue to finalization`.
- Allow freeform input so the user can specify a custom subset (e.g. `QA-1, QA-3`).

### Step 4 — Resolve selected issues

For each selected finding (or all findings if "All" was chosen):

1. Before dispatching, print:
   ```text
   → Dispatching fix for QA-N: <short description>
   ```
2. Spawn one `PBI Implementer` agent with the prompt constructed as follows:
   - Include the full `Developer Agent Instructions` from this file verbatim.
   - Include the specific QA finding text (verbatim from the QA report) as the PBI scope.
   - Include the relevant original PBI full texts and dependency outputs for context.
   - Include the current learnings log.
3. When the agent completes, print the result line:
   - Done: `✓ QA-N fix done`
   - Blocked: `✗ QA-N fix BLOCKED — <blocker description>`
4. Parse the status block using the same `Developer Status Block Contract`.
   - Record changed files, outputs, and any new learnings into the running log.

Process all selected fixes sequentially before proceeding.

### Step 5 — Re-run QA (if any fixes were applied)

If at least one fix agent returned `DONE`, spawn `Quality Assurance` again with the same inputs as the original QA Pass, plus the fix status blocks. Print the updated QA report verbatim before continuing.

## Final Documentation and Testing-Plan Pass

Run this pass only after QA issue resolution is complete and, when any fix
agent returned `DONE`, the follow-up QA report has been received. This ensures
both agents work from the final implementation state, including any QA fixes.

Start the following independent agents in parallel:

### Documentation Agent

- If the learnings log has at least one non-`none` entry, spawn `Documentation Agent`.
- Pass:
  - Full documentation instructions from this file (section: `Documentation Agent Instructions`).
  - The complete learnings log with PBI/QA identifiers.
  - Consolidated status blocks from every PBI Implementer and QA fix agent.
- If there are no learnings to document, skip this agent and report `No learnings to document.`

### Testing Plan Agent

- Always invoke the `testing-plan` agent after all implementation and selected QA fixes are complete, even if there were no QA findings or the learnings log is empty.
- Pass:
  - Full testing-plan agent instructions from `.github/agents/testing-plan.agent.md`.
  - Full text of every dispatched PBI, including PBIs marked DONE, BLOCKED, or SKIPPED.
  - Status blocks from every PBI Implementer and QA fix agent, plus the final QA report.
  - Consolidated changed-file list and implementation/QA-fix summaries so the plan covers the delivered state.
  - Any user-provided constraints or manual verification items relevant to the changes.
- Require a plan for the final implementation state, with every case initially marked `NOT RUN`; the agent must not claim any case was executed.
- Record the exact generated plan document name/path returned by the agent. If invocation fails or returns no path, report that explicitly; do not invent a path.

Wait for both agents to complete before assembling the Final Report. The testing-plan agent creates the manual plan, while the Documentation Agent consolidates implementation learnings.

## Final Report (Required)

### 7a - Status summary

Print exactly:

```text
=== Implementation complete ===

DONE (N):    PBI-1, PBI-2, ...
BLOCKED (N): PBI-X — <reason>
SKIPPED (N): PBI-Y — blocked by PBI-X
```

### 7b - Changes summary

Consolidate changed files across DONE PBIs and QA fix agents, grouped by new vs modified:

```text
=== Changes made ===

New files:
  - path/to/file  (PBI-N)

Modified files:
  - path/to/file  (PBI-N, PBI-M)
```

### 7c - Documentation updates

- Append full output from `Documentation Agent` verbatim.
- If skipped due to empty learnings: `No learnings to document.`

### 7d - Manual testing plan

- Report the exact plan document name/path returned by the `testing-plan` agent.
- State that its cases are `NOT RUN` until the `automated-testing` agent executes them.
- If plan generation failed or returned no path, state that clearly.

### 7e - QA report

- Append the **final** QA report verbatim (re-run report if fixes were applied; original otherwise).

### 7f - Next steps

Include this section only if any blocked/skipped PBIs exist, any QA fix was blocked, or the final QA report still has critical/high findings:

```text
Blocked/skipped — action required:
  - PBI-X: <fix description>
  - Re-run: /orchestrator <PBI-X, PBI-Y, ...>

QA issues still requiring fixes:
  - [QA-N] <file> — <description>
```

If everything completed and the final QA report has no critical/high findings, omit section 7f.

## Lean Context Strategy

To keep context window lean:

- Dispatch one developer agent at a time.
- Pass only:
  - Full text for current PBI.
  - Dependency outputs relevant to current PBI.
  - Minimal orchestration metadata for current wave and running learnings log.
- Do not attach unrelated prior PBI full texts unless required by dependency.

## Developer Agent Instructions

Provide the following verbatim to each `PBI Implementer` agent:

```text
You are the developer implementation agent for one PBI.

Execution contract:
1. Read and follow repository instructions and quality gates.
2. Implement only the provided PBI scope.
3. If blocked, stop and report blocker clearly.
4. Return exactly one parseable status block in this format, then include a concise human-readable implementation summary after it:

STATUS: DONE | BLOCKED
PBI: PBI-X
Changed files:
- <path>
Outputs for dependents:
- <key>: <value>
Manual verification items:
- <item or none>
Learnings:
- <learning or none>
Blocker:
- <description or none>

Rules:
- Keep Changed files concrete and complete.
- Outputs for dependents should include reusable artifacts or IDs produced during implementation.
- Learnings should include practical implementation lessons; write `none` if none.
- If STATUS is BLOCKED, include actionable blocker details.
```

## Documentation Agent Instructions

Provide the following verbatim to `Documentation Agent`:

```text
You are the documentation consolidation agent.

Inputs:
- Learnings log with PBI tags.
- DONE status blocks.

Task:
- Keep only meaningful, reusable learnings.
- Organize by domain and impact.
- Propose concrete documentation updates.
- Return the exact markdown content to append in the orchestrator final report.

Do not include implementation speculation not supported by the inputs.
```

## Testing Plan Agent Instructions

Provide these instructions to the `testing-plan` agent together with the
complete final-state context specified in the Final Documentation and
Testing-Plan Pass:

```text
You are the manual testing-plan agent. Create a concrete, executable plan for
the final delivered implementation using the full PBI scope, implementation
and QA-fix status blocks, final QA report, changed files, and repository
instructions.

Save the plan under docs-local/ using the naming convention in
.github/agents/testing-plan.agent.md. Include cases for behavior introduced or
changed by implementation and QA fixes. Start every case as NOT RUN. Do not
claim that any case passed or failed; execution belongs to automated-testing.

Return the exact plan document name/path, a concise scope summary,
prerequisites, and any assumptions or cases that cannot be tested.
```

## QA Agent Instructions

Provide the following verbatim to `Quality Assurance`:

```text
You are the QA review agent for orchestrated PBI delivery.

Inputs:
- Full intended scope (all dispatched PBI full texts, including done/blocked/skipped).
- All developer status blocks.

Task:
- Review for bugs, regressions, missing tests, and delivery gaps against intended scope.
- Prioritize findings by severity (Critical, High, Medium, Low).
- Identify blocked/skipped fallout risks.
- Provide concrete fix guidance and retest recommendations.
- Return a complete QA report suitable for verbatim inclusion in the orchestrator final report.
```

## Failure Handling

- If no parseable PBIs are found, report and stop.
- If dependency graph invalid (unknown dependency or cycle), report and stop.
- If developer agent fails to return a parseable status block, mark PBI `BLOCKED` with reason `Invalid agent status format`.
- If documentation, QA, or testing-plan agent invocation fails, report failure inline in the final report and continue assembling remaining sections. If testing-plan fails or returns no path, state that no plan document was produced.

## Completion Criteria

This skill is complete only when:

1. All waves are processed with required headers and per-PBI dispatch/result lines.
2. Cascading skipped behavior has been applied for all blocked PBIs.
3. After QA resolution, documentation was executed or explicitly skipped for empty learnings.
4. QA pass executed and QA report shown to user before Final Report.
5. If QA findings existed, user was interactively asked which issues to resolve (default: "All").
6. Selected QA issues were dispatched to individual `PBI Implementer` agents (one per issue).
7. If any fixes were applied, a follow-up QA pass was run.
8. Testing-plan agent was invoked after implementation/QA fixes, in parallel with the Documentation Agent when applicable.
9. Final report includes the exact testing-plan document name/path and sections 7a to 7e; 7f is conditional.
