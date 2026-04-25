## GET /users
**Module:** users | **Operation:** 📖 read | **Confidence:** ███████░░░ 70/100

### What it does
Get all users

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
List of users

### Execution Flow
`findAll()` → `findAll()` → `user.findMany`
### Business Logic
`findAll()` — Calls `user.findMany`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
### Notes
Requires JwtAuthGuard + RolesGuard.

### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L33)
