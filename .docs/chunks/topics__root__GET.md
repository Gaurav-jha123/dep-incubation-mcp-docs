## GET /topics
**Module:** topics | **Operation:** 📖 read | **Confidence:** ██████████ 100/100

### What it does
Get all topics

### Request
| Param | Type | Source |
|-------|------|--------|
| `query` | `PaginationQueryDto` | query |

### Response
List of topics

### Execution Flow
`findAll()` → `findAll()` → `topic.findMany`, `topic.count`
### Business Logic
`findAll()` — Calls `topic.findMany`, `topic.count`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
### Notes
Requires JwtAuthGuard + RolesGuard.

### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L35)
