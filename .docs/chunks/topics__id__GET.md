## GET /topics/:id
**Module:** topics | **Operation:** 📖 read | **Confidence:** █████████░ 90/100

### What it does
Get topic by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
Topic found

### Execution Flow
`findOne()` → `findOne()` → `topic.findUnique`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |
### Business Logic
`findOne()` — Calls `topic.findUnique`. May throw: NotFoundException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard

### Errors
| Status | Description |
|--------|-------------|
| 404 | Topic not found |
### Notes
Requires JwtAuthGuard + RolesGuard.

### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L42)
