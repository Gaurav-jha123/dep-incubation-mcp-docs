## POST /auth/refresh
**Module:** auth | **Operation:** ❓ unknown | **Confidence:** ███████░░░ 70/100

### What it does
Refresh access token

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `RefreshTokenDto` | body |

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
`refreshToken()` — No direct DB calls. May throw: UnauthorizedException.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Invalid refresh token |
### Notes
No authentication required (public endpoint).

### Source
[apps/api/src/modules/auth/auth.controller.ts](apps/api/src/modules/auth/auth.controller.ts#L45)
