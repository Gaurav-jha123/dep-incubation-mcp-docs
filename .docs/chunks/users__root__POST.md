## POST /users
**Module:** users | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Create user with username only

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateUserDto` | body |

### Request Body Fields
**CreateUserDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `username` | `string` | Yes | john.doe |

### Response
User created successfully

### Execution Flow
`create()` → `createUser()` → `user.findUnique`, `user.create`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |
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
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L40)
