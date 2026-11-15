---
name: danta-labs-issue-orchestrator
description: 'Plan and, after approval, organize Danta Labs work into one GitHub parent issue with directly linked sub-issues. No custom issue types or GitHub Project required.'
argument-hint: 'An idea, an existing parent issue number or URL, or a request to verify an existing issue hierarchy'
user-invocable: true
disable-model-invocation: false
---

# Danta Labs issue orchestrator

Organize work in `ericka-cespedes/danta-labs-space-apps-challenge-2026`
using ordinary GitHub issues and native sub-issue relationships.
This skill organizes issues; it does not implement code, run tests, or open PRs.

## Target shape

- One parent issue describes the shared problem, expected outcome, scope,
  and acceptance criteria.
- Each delivery task is a separate issue linked directly under that parent.
- Keep task scope small, testable, and independently reviewable.
- Do not require custom `Epic` or `Sub-Task` issue types, type labels,
  or a GitHub Project.
- Do not encode ordering or internal planning identifiers in issue titles.
  Put real dependencies in task bodies using issue links.
- Keep the default scope simple: do not add a backend, database,
  authentication, or deployment workflows unless explicitly requested.

## Safety and approval

- Default to read-only planning. Show the proposed parent and task bodies,
  existing issues to reuse, dependency map, and every intended change.
- Ask for explicit approval with the available user-question tool before
  creating or editing issues or changing their relationships.
- A request to install this skill is not approval to create issues.
- If requirements are unclear, clarify before proposing a final plan.
- Never invent owners, due dates, project membership, or product decisions.
- Preserve existing comments, labels, assignees, milestones, and unrelated
  issue content. Do not close, delete, reopen, or reparent issues without
  specific approval.
- If approved scope changes materially, show the revised plan and ask again.

## 1. Gather context

1. Confirm authenticated GitHub access and the target repository:

   ```bash
   gh repo view ericka-cespedes/danta-labs-space-apps-challenge-2026 --json nameWithOwner,url,hasIssuesEnabled
   ```

2. For an existing issue, fetch its title, body, state, and URL:

   ```bash
   gh issue view "<number-or-url>" --repo ericka-cespedes/danta-labs-space-apps-challenge-2026 --json number,title,body,state,url
   ```

   Reject PR references and references to other repositories. Do not modify
   another repository based on an input URL.
3. Search for related issues, including closed ones, before suggesting new
   issues. Inspect likely matches rather than treating similar titles as proof
   of equivalence. Prefer reuse when scope matches; identify conflicts.
4. If using an existing parent, inspect all its current sub-issues:

   ```bash
   gh api --paginate "repos/ericka-cespedes/danta-labs-space-apps-challenge-2026/issues/<parent-number>/sub_issues?per_page=100"
   ```

5. Inspect any existing task's parent before proposing a new relationship.
   Do not infer that it has no parent from an unexplained API failure.
6. If access or required capabilities are unavailable, report the concrete
   blocker. Never silently substitute a checklist for native relationships.

## 2. Propose the plan

Show the proposed parent title and body with these sections:

- Problem
- Expected outcome
- Scope (in and out)
- Acceptance criteria

For each task, show its title and body:

- Objective
- Scope
- Acceptance criteria
- Verification
- Depends on (existing issue links, proposed task titles, or `None`)

Then show one parent-to-task map, which issues will be created versus reused,
and any edits or relationship changes. Validate that dependencies refer to
known tasks and contain no cycles. Use proposed titles until GitHub assigns
real issue numbers; never invent IDs.

Ask the user to approve this exact plan. Stop without writes if approval is
declined, missing, or ambiguous.

## 3. Apply only the approved plan

1. Re-read issues to detect conflicts with changes made since approval.
   Stop and ask if relevant content or relationships changed.
2. Create or reuse the parent, then create or reuse the approved task issues
   sequentially. Use GitHub CLI with explicit repository and body files outside
   the checkout. Preserve unapproved content.
3. Record each returned URL and actual issue number immediately. Resolve
   dependencies to those real issue links after all approved tasks exist.
4. For each task, obtain its numeric REST issue ID:

   ```bash
   gh api repos/ericka-cespedes/danta-labs-space-apps-challenge-2026/issues/<task-number> --jq '.id'
   ```

5. If not already linked correctly, add it under the parent:

   ```bash
   gh api --method POST \
     repos/ericka-cespedes/danta-labs-space-apps-challenge-2026/issues/<parent-number>/sub_issues \
     -F sub_issue_id=<numeric-rest-issue-id>
   ```

   `sub_issue_id` is the task's numeric REST `id`, not its issue number
   or GraphQL node ID. Do not set `replace_parent` unless reparenting this
   exact task was explicitly approved. Skip relationships already correct.
6. On failure, report created issues, completed links, and remaining work.
   Do not delete successful results or retry creation blindly. Re-read remote
   state before retrying to avoid duplicate issues.
7. Clean up only temporary body files created by this run.

## 4. Verify and hand off

Read back the parent and its paginated sub-issue list. For every approved task,
verify title, body, state, resolved dependency links, and native parent:

```bash
gh api repos/ericka-cespedes/danta-labs-space-apps-challenge-2026/issues/<task-number>/parent
```

Require the returned parent to match the exact intended repository and issue.
Report a compact table with issue URL, title, parent, and result.
Report pre-existing unrelated children separately; do not remove them.
State `Project: not required`.

Only claim completion when every approved creation, edit, and relationship has
been read back successfully. Verification-only requests perform no writes.

Offer a separate implementation task only after the issue hierarchy is
approved. Creating the hierarchy does not implement it.

## Usage

- `/danta-labs-issue-orchestrator plan a simple responsive webpage`
- `/danta-labs-issue-orchestrator <parent-issue-url> organize the remaining work`
- `/danta-labs-issue-orchestrator verify <parent-issue-url>`
