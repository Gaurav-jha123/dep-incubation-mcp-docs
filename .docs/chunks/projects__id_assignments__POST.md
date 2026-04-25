## POST /projects/:id/assignments
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Assign a user to a project

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `dto` | `AssignUserDto` | body |

### Request Body Fields
**AssignUserDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `userId` | `number` | Yes | 3 |
| `startDate` | `string` | No | 2026-01-01 |
| `endDate` | `string` | No | 2026-12-31 |

### Response
User assigned

### Execution Flow
`assignUser()` → `assignUser()` → `projectAssignment.create`, `project.findUnique`, `topic.findMany`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |
### Business Logic
`assignUser()` — Calls `projectAssignment.create`, `project.findUnique`, `topic.findMany`. May throw: ConflictException.

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
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L100)
