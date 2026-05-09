## PATCH /projects/:id
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** [█████████░ 90/100]

### What it does
Update project

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| dto | `UpdateProjectDto` | body |

### Response
Project updated

### Execution Flow
`update()` → `update()` → `project.update`, `project.findUnique`, `topic.findMany`

### Business Logic
The `update()` service method performs three Prisma operations: `project.update`, `project.findUnique`, and `topic.findMany`. It retrieves a project by ID (`project.findUnique`) and updates the existing project (`project.update`) based on the provided `UpdateProjectDto`. Additionally, it fetches all associated topics (`topic.findMany`) for the project. If the project is not found, it returns a 404 error. The `JwtAuthGuard` and `RolesGuard` are applied to ensure authentication and authorization, requiring either an ADMIN or MANAGER role to invoke this endpoint.

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN, MANAGER. Note that this endpoint performs multiple database operations, which may increase the overall latency of the API call. Additionally, it is assumed that the provided `UpdateProjectDto` is validated and sanitized to prevent any potential security vulnerabilities.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L76)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:48:52.155Z
