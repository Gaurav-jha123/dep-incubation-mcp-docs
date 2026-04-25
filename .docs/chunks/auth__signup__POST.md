## POST /auth/signup
**Module:** auth | **Operation:** 🔀 mixed | **Confidence:** █████████░ 90/100

### What it does
Register a new user

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `SignupDto` | body |

### Request Body Fields
**SignupDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `name` | `string` | Yes | John Doe |
| `email` | `string` | Yes | john@example.com |
| `password` | `string` | Yes | password123 |

### Response
User registered successfully

### Execution Flow
`signup()` → `signup()` → `user.findUnique`, `user.create`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |
### Business Logic
`signup()` — Calls `user.findUnique`, `user.create`. May throw: ConflictException.

### Errors
| Status | Description |
|--------|-------------|
| 409 | Email already registered |
### Notes
No authentication required (public endpoint).

### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L28)
