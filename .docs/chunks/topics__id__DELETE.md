## DELETE /topics/:id
**Module:** topics | **Operation:** 🔀 mixed | **Confidence:** ███████░░░ 70/100

### What it does
Delete topic

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
`unknown`

### Execution Flow
`remove()` → `remove()` → `topic.delete`, `topic.findUnique`
### Business Logic
`remove()` — Calls `topic.delete`, `topic.findUnique`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L67)
