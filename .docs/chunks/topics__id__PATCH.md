## PATCH /topics/:id
**Module:** topics | **Operation:** 🔀 mixed | **Confidence:** ████████░░ 80/100

### What it does
Update topic

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `dto` | `UpdateTopicDto` | body |

### Request Body Fields
**UpdateTopicDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `label` | `string` | No | JavaScript |
| `description` | `string` | No | Core concepts of JS like closures, promises, etc. |

### Response
`unknown`

### Execution Flow
`update()` → `update()` → `topic.update`, `topic.findUnique`
### Business Logic
`update()` — Calls `topic.update`, `topic.findUnique`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L59)
