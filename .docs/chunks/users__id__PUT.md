## PUT /users/:id
**Module:** users | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Update user by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `dto` | `UpdateUserDto` | body |

### Request Body Fields
**UpdateUserDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `username` | `string` | Yes | john.updated |

### Response
User updated successfully

### Execution Flow
`update()` → `updateUser()` → `user.findUnique`, `user.update`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |
| `ConflictException` |
### Business Logic
`updateUser()` — Calls `user.findUnique`, `user.update`. May throw: NotFoundException, ConflictException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN

### Errors
| Status | Description |
|--------|-------------|
| 404 | User not found |
| 409 | Generated email already registered |
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L52)
