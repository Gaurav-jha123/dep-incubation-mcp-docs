## POST /users
**Module:** users

### What it does
Create user with username only

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateUserDto` | body |

### Response
User created successfully

### Business Logic
`createUser()` — Calls `user.findUnique`, `user.create`. May throw: ConflictException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN

### Errors
| Status | Description |
|--------|-------------|
| 409 | Generated email already registered |
### Notes
Requires JWT authentication. See module guards for role requirements.
