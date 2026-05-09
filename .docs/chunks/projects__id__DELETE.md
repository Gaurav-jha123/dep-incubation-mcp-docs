## DELETE /projects/:id
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** [█████████░ 90/100]

### What it does
Delete project

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
Project deleted

### Execution Flow
`remove()` → `remove()` → `project.delete`, `project.findUnique`, `topic.findMany`

### Business Logic
The `remove()` service method deletes a project by calling the `project.delete` Prisma operation, which also triggers calls to `project.findUnique` for verification and `topic.findMany` for potentially related entities. This operation assumes the project exists in the database. If the project is not found, a 404 error is thrown. Additionally, the business logic assumes that the roles guard and JWT authentication guard have successfully authenticated the request.

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN, MANAGER. Note that the operation assumes the project is already verified by `project.findUnique` before deletion. Any attempts to delete a non-existent project will throw a 404 error.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L90)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:49:07.768Z
