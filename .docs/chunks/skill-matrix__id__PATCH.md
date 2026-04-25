## PATCH /skill-matrix/:id
**Module:** skill-matrix | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Update a skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `dto` | `UpdateSkillMatrixDto` | body |

### Request Body Fields
**UpdateSkillMatrixDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `topicId` | `number` | No | 1 |
| `value` | `number` | No | 85 |

### Response
Skill matrix entry updated successfully

### Execution Flow
`update()` → `update()` → `skillMatrix.update`, `skillMatrix.findUnique`

### Error Conditions
| Exception |
|-----------|
| `ForbiddenException` |
### Business Logic
`update()` — Calls `skillMatrix.update`, `skillMatrix.findUnique`. May throw: ForbiddenException.

### Auth
**Guards:** JwtAuthGuard

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Forbidden — not your entry |
| 404 | Skill matrix entry not found |
### Notes
Requires JwtAuthGuard.

### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L69)
