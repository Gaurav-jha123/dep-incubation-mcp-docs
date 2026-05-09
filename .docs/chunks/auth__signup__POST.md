## POST /auth/signup
**Module:** auth | **Operation:** 🔀 mixed | **Confidence:** [█████████░ 90/100]

### What it does
Register a new user

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `SignupDto` | body |

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
When a new user attempts to register, the `signup()` method checks if an existing user with the same email already exists in the database using the `user.findUnique` Prisma operation. If a match is found, a `ConflictException` is thrown. If no match is found, the method creates a new user using the `user.create` Prisma operation.

### Errors
| Status | Description |
|--------|-------------|
| 409 | Email already registered |

### Notes
No authentication required (public endpoint). This endpoint does not have any special edge cases. However, it's worth noting that the password will be stored securely, but the exact encryption method is not specified in this documentation.
### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L28)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:46:46.423Z
