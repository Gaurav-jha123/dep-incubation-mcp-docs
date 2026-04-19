## GET /
**Module:** app

### What it does
Health check

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
`string`

### Business Logic
`getHello()` — No direct DB calls.
### Notes
Requires JWT authentication. See module guards for role requirements.
