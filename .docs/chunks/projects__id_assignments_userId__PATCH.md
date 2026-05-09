## PATCH /projects/:id/assignments/:userId
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Update assignment status

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| userId | `number` | param |
| dto | `UpdateAssignmentStatusDto` | body |

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
This endpoint updates the status of an assignment by calling the `updateAssignmentStatus()` service method. It performs a database operation to update the `projectAssignment` using `project.findUnique` and `topic.findMany` operations. If the authenticated user does not have the correct permissions, a `ForbiddenException` is thrown. If the project is not found, a `NotFoundException` is thrown.

### Errors
| Status | Description |
|--------|-------------|
| 403 | Cannot update another user assignment |
| 404 | Project not found |

### Notes
Requires JwtAuthGuard + RolesGuard.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L135)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:49:54.828Z
