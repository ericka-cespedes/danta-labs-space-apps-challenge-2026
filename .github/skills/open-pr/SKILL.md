---
name: open-pr
description: 'Open a feature pull request against main with safe branch handling, a verified associated issue, and accurate validation evidence.'
argument-hint: 'Associated GitHub issue number or URL, plus optional reviewer focus or PR notes'
user-invocable: true
disable-model-invocation: false
---

# Open PR

Open a feature pull request from the active checkout against `origin/main`.
Use the active worktree; never switch or modify another session's checkout.
Do not merge a PR, deploy, or rewrite branch history unless explicitly requested.

## Preconditions and context

1. Read repository instructions and inspect the active checkout:

   ```bash
   git rev-parse --show-toplevel
   git status --short --branch
   git worktree list --porcelain
   git branch --show-current
   git remote -v
   ```

2. Require an `origin` remote and authenticated GitHub CLI. Verify the intended
   repository and its `main` branch. If they are inaccessible, stop with the
   concrete blocker.
3. Fetch the baseline and inspect the changes:

   ```bash
   git fetch origin main:refs/remotes/origin/main
   git diff --stat
   git diff --cached --stat
   git ls-files --others --exclude-standard
   git log --oneline origin/main..HEAD
   git diff --stat origin/main...HEAD
   git diff --name-only origin/main...HEAD
   ```

   Read the relevant diffs and files before drafting. If there are no requested
   changes against `origin/main`, stop rather than creating an empty PR.

## Mandatory associated issue

- Use the issue explicitly supplied by the user, or infer one only from clear
  evidence matching the actual changes. Verify it in the intended repository:

  ```bash
  gh issue view "<issue-number-or-url>" --repo "<owner/repo>" --json number,title,body,url,state
  ```

- Confirm it is an issue, not a PR, and its scope matches the changes.
- If missing, ambiguous, or inaccessible, ask for a valid issue before committing,
  pushing, or creating a PR. Stop if it cannot be verified.
- Never invent or create an issue without a separate request.

## Safe feature branch preparation

- Keep the existing feature branch unless the user requests a new one.
- If on `main` or detached HEAD, create an unused descriptive feature branch
  in the active worktree at its current HEAD:

  ```bash
  git check-ref-format --branch "<feature-branch>"
  git switch -c "<feature-branch>"
  ```

- Check local refs and registered worktrees for naming collisions first.
- Preserve uncommitted changes. Never force-switch, overwrite branches, stash or
  transfer another session's work, reset changes, or force-push.
- Never push requested feature changes directly to `main`.

## Validation and PR description

1. Inspect `.github/pull_request_template.md` and `.github/PULL_REQUEST_TEMPLATE/`.
   If a template exists, preserve its headings, comments, checklist items, and
   order, replacing placeholders with accurate details.
2. Read documented validation commands and inspect the tooling actually present.
   Run the smallest relevant checks. Do not assume a framework, package manager,
   build, database, or test runner exists. Documentation-only changes need no
   application tests unless documentation tests are configured.
3. Record each exact command with its result. State checks not run and why.
   Never mark an unexecuted or failing check complete.
4. Use a concise behavior-focused title, such as `feat:`, `fix:`, or `docs:`.
5. Without a template, use these description sections:
   - Summary
   - Related issue
   - Changes made
   - Validation
   - Breaking changes
   - Additional notes
6. Include the verified issue's title and reference. Put `Closes #<number>` on its
   own line after the summary for an issue in the PR repository. Use
   `Closes <owner>/<repo>#<number>` for an issue in another repository.
7. Include screenshots only when available and relevant. Explain actual risks
   and breaking changes; otherwise state `None`.

## Commit, push, and create

1. Stage only inspected, requested files. Leave unrelated changes untouched.
2. Commit uncommitted requested changes with a descriptive message and trailer:

   ```text
   Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
   ```

   Omit the trailer only if the user explicitly asks. Never amend without
   permission. Reinspect the committed diff against `origin/main`.
3. Push the feature branch:

   ```bash
   git push --set-upstream origin "<feature-branch>"
   ```

   Stop on rejection; do not rewrite history to bypass it.
4. Check for a matching existing PR:

   ```bash
   gh pr list --repo "<owner/repo>" --head "<feature-branch>" --base main --state open
   ```

   Reuse it instead of duplicating it. Update its description only if requested.
5. Save the description in a temporary file outside the repository and create:

   ```bash
   gh pr create --repo "<owner/repo>" --base main --head "<feature-branch>" --title "<title>" --body-file "<temporary-file>"
   ```

   Add `--draft` only when requested. Clean up the temporary file afterwards.
6. Verify the published URL, open state, head, base, body, and remote branch SHA
   against local HEAD before reporting success.

## Verify issue linkage

For new or reused PRs, verify that GitHub records the exact issue as a closing
reference; a body mention alone is not evidence of that relationship.

```bash
pr_id=$(gh pr view "<pr-number-or-url>" --repo "<pr-owner/repo>" --json id --jq '.id')
issue_id=$(gh issue view "<issue-number-or-url>" --repo "<issue-owner/repo>" --json id --jq '.id')
gh pr view "<pr-number-or-url>" --repo "<pr-owner/repo>" --json url,closingIssuesReferences
```

Stop if either ID lookup fails or returns an empty ID. If the exact issue ID and
URL are not in the closing references, explicitly link them:

```bash
gh api graphql \
  -f query='mutation($issueId: ID!, $pullRequestId: ID!) { addCloseIssueReferences(input: {issueId: $issueId, pullRequestIds: [$pullRequestId]}) { clientMutationId } }' \
  -f issueId="$issue_id" \
  -f pullRequestId="$pr_id"
gh pr view "<pr-number-or-url>" --repo "<pr-owner/repo>" --json url,closingIssuesReferences
```

Verify the exact issue node ID and URL after the mutation. On failure, report
the existing PR URL and linkage blocker without deleting it, creating a
duplicate, or claiming success.

## Completion

Report the PR URL, verified linked issue, base/head, and validation outcomes.
Do not merge the PR or claim that manual testing passed without executing it.
