## POST /auth/login
**Module:** auth | **Operation:** 📖 read | **Confidence:** █████████░ 90/100

### What it does
Login with email and password

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `LoginDto` | body |

### Request Body Fields
**LoginDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `email` | `string` | Yes | john@example.com |
| `password` | `string` | Yes | password123 |

### Response
Login successful

### Execution Flow
`login()` → `login()` → `user.findUnique`

### Error Conditions
| Exception |
|-----------|
| `UnauthorizedException` |
### Business Logic
`login()` — Calls `user.findUnique`. May throw: UnauthorizedException.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Invalid credentials |
### Notes
No authentication required (public endpoint).

### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L36)
