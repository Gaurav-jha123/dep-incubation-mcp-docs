## GET /topics
**Module:** topics

### What it does
Get all topics

### Request
| Param | Type | Source |
|-------|------|--------|
| `query` | `PaginationQueryDto` | query |

### Response
List of topics

### Business Logic
`findAll()` — Calls `topic.findMany`, `topic.count`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
### Notes
Requires JWT authentication. See module guards for role requirements.
