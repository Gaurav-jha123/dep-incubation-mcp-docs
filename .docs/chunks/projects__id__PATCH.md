## PATCH /projects/:id
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** █████████░ 90/100

### What it does
Update project

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `dto` | `UpdateProjectDto` | body |

### Response
Project updated

### Execution Flow
`update()` → `update()` → `project.update`, `project.findUnique`, `topic.findMany`
### Business Logic
`update()` — Calls `project.update`, `project.findUnique`, `topic.findMany`.

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
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L76)
