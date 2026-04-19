## GET /skill-matrix
**Module:** skill-matrix

### What it does
Get all skill matrix entries

### Request
| Param | Type | Source |
|-------|------|--------|
| `query` | `PaginationQueryDto` | query |

### Response
List of skill matrix entries

### Business Logic
`findAll()` — Calls `skillMatrix.findMany`, `skillMatrix.count`.

### Auth
**Guards:** JwtAuthGuard
### Notes
Requires JWT authentication. See module guards for role requirements.
