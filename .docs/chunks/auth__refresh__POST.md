## POST /auth/refresh
**Module:** auth | **Operation:** ❓ unknown | **Confidence:** [███████░░░ 70/100]

### What it does
Refresh access token

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `RefreshTokenDto` | body |

### Request Body Fields
**RefreshTokenDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `refreshToken` | `string` | Yes | eyJhbGciOiJIUzI1NiIs... |

### Response
Token refreshed

### Execution Flow
`refresh()` → `refreshToken()`

### Error Conditions
| Exception |
|-----------|
| `UnauthorizedException` |

### Business Logic
The `refreshToken()` method, called by the `refresh()` handler, retrieves a new access token without making any direct database calls. It validates the provided refresh token and throws an `UnauthorizedException` if it is invalid. The method does not utilize Prisma operations.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Invalid refresh token |

### Notes
No authentication required (public endpoint). The refresh token must be provided in the request body to successfully refresh the access token.
### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L45)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:47:17.792Z
