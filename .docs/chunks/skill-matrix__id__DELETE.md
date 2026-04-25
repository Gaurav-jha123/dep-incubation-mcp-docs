## DELETE /skill-matrix/:id
**Module:** skill-matrix | **Operation:** 🔀 mixed | **Confidence:** █████████░ 90/100

### What it does
Delete a skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
Skill matrix entry deleted successfully

### Execution Flow
`remove()` → `remove()` → `skillMatrix.delete`, `skillMatrix.findUnique`

### Error Conditions
| Exception |
|-----------|
| `ForbiddenException` |
### Business Logic
`remove()` — Calls `skillMatrix.delete`, `skillMatrix.findUnique`. May throw: ForbiddenException.

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
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L87)
