## POST /auth/login
**Module:** auth | **Operation:** 📖 read | **Confidence:** [█████████░ 90/100]

### What it does
Login with email and password

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `LoginDto` | body |

### Request Body Fields
**LoginDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `email` | `string` | Yes | john@example.com |
| `password` | `string` | Yes | password123 |

### Response
Login successful

### Execution Flow
`login()` → `login()` → `user.findUnique`

### Error Conditions
| Exception |
|-----------|
| `UnauthorizedException` |

### Business Logic
The `login()` method is called twice in sequence, first to initiate the login process and second to verify the user. It performs a Prisma operation `user.findUnique` to retrieve the user from the database. If the user is not found or the provided credentials are invalid, it throws an `UnauthorizedException`. 

### Errors
| Status | Description |
|--------|-------------|
| 401 | Invalid credentials |

### Notes
No authentication required (public endpoint). Note that invalid credentials will result in a 401 status code.
### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L36)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:47:02.001Z
