## PUT /users/:id
**Module:** users | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Update user by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| dto | `UpdateUserDto` | body |

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
The `updateUser()` method performs the following database operations: it first calls `user.findUnique` to retrieve the user by ID, and then calls `user.update` to update the user's information based on the provided `UpdateUserDto`. This process throws a `NotFoundException` if the user is not found, or a `ConflictException` if the generated email is already registered. The update operation requires the user to have the correct role (ADMIN) and be authenticated with a valid JWT.

### Errors
| Status | Description |
|--------|-------------|
| 404 | User not found |
| 409 | Generated email already registered |

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.
### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L52)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:53:33.578Z
