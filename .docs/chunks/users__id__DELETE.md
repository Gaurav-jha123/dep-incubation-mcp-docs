## DELETE /users/:id
**Module:** users

### What it does
Delete user by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
User deleted successfully

### Business Logic
`removeUser()` — Calls `user.findUnique`, `user.delete`. May throw: NotFoundException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN

### Errors
| Status | Description |
|--------|-------------|
| 404 | User not found |
### Notes
Requires JWT authentication. See module guards for role requirements.
