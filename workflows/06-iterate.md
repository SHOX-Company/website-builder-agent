# Workflow 06 — Iterate

## Objective
Fix layout, copy, timing, or mobile issues identified during QA or after client feedback.

## Inputs
- `ISSUE_LIST` — list of specific issues to fix (from QA report or client notes)
- `TARGET_PROJECT` — project folder under `projects/`

## Tools
- None by default — use tools only if asset processing is needed

## Execution Steps

1. **Prioritize issues**
   Order issues by impact:
   - P0 (blocking): site broken, CTA missing, mobile unusable
   - P1 (high): layout broken, copy unclear, animation janky
   - P2 (low): spacing tweaks, copy polish, animation tuning

2. **For each issue:**

   a. **Identify root cause** — read the error or inspect the element
   Do NOT guess. Find the actual cause before touching code.

   b. **Fix locally**
   Make the smallest change that fixes the root cause.
   Do not refactor surrounding code unless it is the cause.

   c. **Re-test the fix**
   - Reload the local dev server
   - Confirm the issue is resolved
   - Confirm no regressions introduced

3. **Re-run QA (Workflow 04)**
   After all issues are fixed, run a full QA pass.
   Do not skip this — fixes often introduce new issues.

4. **Re-deploy if needed (Workflow 05)**
   Only if the fixes are for a live production site:
   ```bash
   git add .
   git commit -m "fix: {{describe fixes}}"
   git push
   ```

5. **Log lesson**
   Append to `workflows/lessons.md`:
   ```
   ## {{date}} — {{PROJECT_NAME}}
   - Issue: {{what broke}}
   - Cause: {{why it broke}}
   - Fix: {{what was changed}}
   - Prevention: {{what to do differently next time}}
   ```

## Outputs
- Fixed site (locally verified, re-deployed if live)
- Lesson logged in `workflows/lessons.md`

## Rules
- Fix root causes, not symptoms
- One issue at a time — do not batch fixes without re-testing each
- If a fix takes more than 30 minutes, escalate and replan
- Mobile is never optional — fix mobile issues with same priority as desktop

## Notes
- If the same issue recurs across projects, extract it into a workflow improvement
- Iteration is part of every build — budget for it
