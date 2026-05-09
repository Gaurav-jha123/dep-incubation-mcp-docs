## DELETE /projects/:id/assignments/:userId
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** [█████████░ 90/100]

### What it does
Remove a user from a project

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| userId | `number` | param |

### Response
User removed

### Execution Flow
`removeUser()` → `removeUser()` → `projectAssignment.delete`, `project.findUnique`, `topic.findMany`

### Business Logic
The `removeUser()` service method performs the following operations:
- Deletes the user's assignment from the `projectAssignment` table using `projectAssignment.delete`.
- Retrieves the project details from the `project` table using `project.findUnique`.
- Retrieves the topics associated with the project from the `topic` table using `topic.findMany`.
If any of these operations fail, an error is thrown.

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN, MANAGER.
Note that if the project or user is not found, an error is thrown with status code 404.
Additionally, if there is an issue with the deletion or retrieval of data, an error may be thrown.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L117)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:49:39.266Z
