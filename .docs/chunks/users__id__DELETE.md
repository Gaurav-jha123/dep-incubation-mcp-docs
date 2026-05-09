## DELETE /users/:id
**Module:** users | **Operation:** 🔀 mixed | **Confidence:** [█████████░ 90/100]

### What it does
Delete user by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
User deleted successfully

### Execution Flow
`remove()` → `removeUser()` → `user.findUnique`, `user.delete`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |

### Business Logic
The `removeUser()` method performs a database operation by first searching for the user with the specified ID through `user.findUnique`, and then deleting the user through `user.delete`. This operation assumes that the user exists in the database, and throws a `NotFoundException` if the user is not found. The `JwtAuthGuard` and `RolesGuard` are applied before processing this request, which requires the user's role to be set to 'ADMIN'.

### Errors
| Status | Description |
|--------|-------------|
| 404 | User not found |
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.
### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L66)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:53:49.188Z
