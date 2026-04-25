## POST /skill-matrix
**Module:** skill-matrix | **Operation:** ✏️ write | **Confidence:** ██████████ 100/100

### What it does
Create a new skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateSkillMatrixDto` | body |

### Request Body Fields
**CreateSkillMatrixDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `topicId` | `number` | Yes | 1 |
| `value` | `number` | Yes | 75 |

### Response
Skill matrix entry created successfully

### Execution Flow
`create()` → `create()` → `skillMatrix.create`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |
### Business Logic
`create()` — Calls `skillMatrix.create`. May throw: ConflictException.

### Auth
**Guards:** JwtAuthGuard

### Errors
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
### Notes
Requires JwtAuthGuard.

### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L54)
