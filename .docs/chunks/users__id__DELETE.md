## DELETE /users/:id
**Module:** users | **Operation:** 🔀 mixed | **Confidence:** █████████░ 90/100

### What it does
Delete user by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
User deleted successfully

### Execution Flow
`remove()` → `removeUser()` → `user.findUnique`, `user.delete`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |
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
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L66)
