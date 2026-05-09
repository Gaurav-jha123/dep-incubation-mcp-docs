## POST /auth/logout
**Module:** auth | **Operation:** ❓ unknown | **Confidence:** [█████░░░░░ 50/100]

### What it does
Logout current user

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
Logged out successfully

### Business Logic
The `/auth/logout` endpoint does not appear to make any database operations. Instead, it likely relies on the `JwtAuthGuard` to validate the user's JWT and then clears the authentication session, effectively logging the user out. If the JWT is invalid or missing, a 401 Unauthorized error is thrown.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |

### Notes
Requires JwtAuthGuard.
### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L64)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:47:49.037Z
