## GET /skill-matrix/:id
**Module:** skill-matrix | **Operation:** 📖 read | **Confidence:** █████████░ 90/100

### What it does
Get a skill matrix entry by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
Skill matrix entry found

### Execution Flow
`findOne()` → `findOne()` → `skillMatrix.findUnique`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |
### Business Logic
`findOne()` — Calls `skillMatrix.findUnique`. May throw: NotFoundException.

### Auth
**Guards:** JwtAuthGuard

### Errors
| Status | Description |
|--------|-------------|
| 404 | Skill matrix entry not found |
### Notes
Requires JwtAuthGuard.

### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L45)
