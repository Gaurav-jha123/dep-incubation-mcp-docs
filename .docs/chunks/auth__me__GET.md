## GET /auth/me
**Module:** auth | **Operation:** 📖 read | **Confidence:** [███████░░░ 70/100]

### What it does
Get current user profile

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
User profile

### Execution Flow
`getProfile()` → `getProfile()` → `user.findUnique`

### Error Conditions
| Exception |
|-----------|
| `UnauthorizedException` |

### Business Logic
The `/auth/me` endpoint calls the `getProfile` service method, which executes the `user.findUnique` Prisma operation to retrieve the current user's profile information. Business rules for this endpoint are minimal, with a primary focus on authentication via JwtAuthGuard. On error, the `getProfile` method throws an `UnauthorizedException`. No additional validation or transformations occur on the data retrieved from the Prisma operation.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |

### Notes
Requires JwtAuthGuard.
### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L54)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:47:33.540Z
