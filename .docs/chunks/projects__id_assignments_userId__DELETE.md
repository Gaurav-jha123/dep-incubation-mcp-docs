## DELETE /projects/:id/assignments/:userId
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** █████████░ 90/100

### What it does
Remove a user from a project

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `userId` | `number` | param |

### Response
User removed

### Execution Flow
`removeUser()` → `removeUser()` → `projectAssignment.delete`, `project.findUnique`, `topic.findMany`
### Business Logic
`removeUser()` — Calls `projectAssignment.delete`, `project.findUnique`, `topic.findMany`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN, MANAGER

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN, MANAGER.

### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L117)
