## POST /auth/logout
**Module:** auth | **Operation:** ❓ unknown | **Confidence:** █████░░░░░ 50/100

### What it does
Logout current user

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
Logged out successfully
### Business Logic
No service methods inferred.

### Auth
**Guards:** JwtAuthGuard

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
### Notes
Requires JwtAuthGuard.

### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L64)
