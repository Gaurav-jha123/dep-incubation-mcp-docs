## GET /auth/me
**Module:** auth | **Operation:** 📖 read | **Confidence:** ███████░░░ 70/100

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
`getProfile()` — Calls `user.findUnique`. May throw: UnauthorizedException.

### Auth
**Guards:** JwtAuthGuard

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
### Notes
Requires JwtAuthGuard.

### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L54)
