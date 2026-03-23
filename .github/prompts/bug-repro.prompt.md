---
description: "Generate a structured bug reproduction report with steps, expected vs actual behavior, and a failing test."
---
# Bug Reproduction Prompt

I need help reproducing and documenting a bug. Walk me through this process:

## 1. Gather Context
Ask me for:
- **Where** the bug occurs (backend API endpoint, frontend page/component, or both)
- **What** the expected behavior is
- **What** actually happens (error messages, wrong data, UI glitch)
- **How** to trigger it (user actions, specific input data, timing)

## 2. Investigate
- Search the codebase for the relevant code paths
- Identify the root cause or narrow down suspects
- Check for related error handling, validation, or state management issues

## 3. Write a Failing Test
Based on the app layer:
- **Backend**: Write a Jest spec in `apps/api/` that reproduces the issue
- **Frontend unit**: Write a Vitest spec in `apps/web/src/` that reproduces the issue
- **Frontend E2E**: Write a Playwright test in `apps/web/tests/` that reproduces the issue

The test MUST fail with the current code to confirm the bug exists.

## 4. Output a Bug Report
Format:
```markdown
### Bug: [Short title]
**Severity**: Critical / High / Medium / Low
**Location**: [file path and function/component]
**Steps to Reproduce**:
1. ...
2. ...
3. ...
**Expected**: [what should happen]
**Actual**: [what happens instead]
**Root Cause**: [brief explanation]
**Failing Test**: [file path to the new test]
**Suggested Fix**: [brief approach]
```
