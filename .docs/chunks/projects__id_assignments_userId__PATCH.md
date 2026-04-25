## PATCH /projects/:id/assignments/:userId
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Update assignment status

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `userId` | `number` | param |
| `dto` | `UpdateAssignmentStatusDto` | body |

### Request Body Fields
**UpdateAssignmentStatusDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `status` | `AssignmentStatus` | Yes | AssignmentStatus.ASSIGNED |

### Response
Assignment status updated

### Execution Flow
`updateAssignmentStatus()` → `updateAssignmentStatus()` → `projectAssignment.update`, `project.findUnique`, `topic.findMany`

### Error Conditions
| Exception |
|-----------|
| `ForbiddenException` |
| `NotFoundException` |
### Business Logic
`updateAssignmentStatus()` — Calls `projectAssignment.update`, `project.findUnique`, `topic.findMany`. May throw: ForbiddenException, NotFoundException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard

### Errors
| Status | Description |
|--------|-------------|
| 403 | Cannot update another user assignment |
| 404 | Project not found |
### Notes
Requires JwtAuthGuard + RolesGuard.

### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L135)
