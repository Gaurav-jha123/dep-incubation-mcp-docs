## GET /projects/:id
**Module:** projects | **Operation:** 📖 read | **Confidence:** █████████░ 90/100

### What it does
Get project by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |

### Response
Project with full details including skills and assignments

### Execution Flow
`findOne()` → `findOne()` → `project.findUnique`, `topic.findMany`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |
### Business Logic
`findOne()` — Calls `project.findUnique`, `topic.findMany`. May throw: NotFoundException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |
### Notes
Requires JwtAuthGuard + RolesGuard.

### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L51)
