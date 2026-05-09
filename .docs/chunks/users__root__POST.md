## POST /users
**Module:** users | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Create user with username only

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `CreateUserDto` | body |

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
Upon receiving a `CreateUserDto` in the request body, `createUser()` method is invoked which calls `user.findUnique` to check if a user with the provided username already exists. If not found, it proceeds to call `user.create` to create a new user with the given credentials. The method throws a `ConflictException` if the email associated with the created user is already registered.

### Errors
| Status | Description |
|--------|-------------|
| 409 | Generated email already registered |

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN. Note that the `createUser()` method only accepts creating a user with a single username parameter, without any other attributes.
### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L40)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:53:17.775Z
