---
name: "jira-test-sync"
description: "Map Jira ticket acceptance criteria to test cases, generate test stubs, and track test coverage against requirements."
---
# Jira Test Sync Skill

## Purpose
Bridge the gap between Jira requirements and test coverage by converting acceptance criteria into actionable test cases.

## Workflow

### Step 1 — Parse Acceptance Criteria
When given a Jira ticket (ID, title, and acceptance criteria), extract each criterion as a testable requirement:

```
Ticket: DASH-123 — Add skill level validation
AC1: Skill value must be between 0 and 100
AC2: Duplicate user+topic entries should return 409
AC3: Non-existent topic ID should return 404
```

### Step 2 — Map to Test Cases
For each acceptance criterion, generate a test case definition:

| AC   | Test Type  | Location                          | Test Description                                      |
|------|-----------|-----------------------------------|------------------------------------------------------|
| AC1  | Unit      | `skill-matrix.service.spec.ts`    | `should reject skill value outside 0-100 range`      |
| AC2  | Unit      | `skill-matrix.service.spec.ts`    | `should throw ConflictException for duplicate entry`  |
| AC3  | Unit      | `skill-matrix.service.spec.ts`    | `should throw NotFoundException for invalid topic`    |
| AC1  | E2E       | `tests/skill-matrix.spec.ts`      | `should show validation error for invalid skill`      |

### Step 3 — Generate Test Stubs
Create test files with descriptive `describe`/`it` blocks, proper imports, and `// TODO: implement` placeholders.

**Backend stub format:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SkillMatrixService } from './skill-matrix.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('SkillMatrixService', () => {
  // ... setup ...

  describe('DASH-123: Add skill level validation', () => {
    it('should reject skill value outside 0-100 range (AC1)', async () => {
      // TODO: implement
    });
  });
});
```

### Step 4 — Coverage Summary
Output a markdown checklist linking each AC to its test status:

```markdown
## DASH-123 Test Coverage
- [x] AC1: Unit test — skill-matrix.service.spec.ts
- [x] AC2: Unit test — skill-matrix.service.spec.ts
- [ ] AC3: E2E test — pending implementation
```

## Conventions
- Tag test descriptions with ticket IDs: `DASH-123: should...`
- One test file per feature module, grouped by ticket in `describe` blocks
- Backend tests: Jest + `@nestjs/testing` + mocked `PrismaService`
- Frontend tests: Vitest + Testing Library or Playwright for E2E
