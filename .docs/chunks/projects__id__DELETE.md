## DELETE /projects/:id
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** █████████░ 90/100

### What it does
Delete project

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
Project deleted

### Execution Flow
`remove()` → `remove()` → `project.delete`, `project.findUnique`, `topic.findMany`
### Business Logic
`remove()` — Calls `project.delete`, `project.findUnique`, `topic.findMany`.

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
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L90)
