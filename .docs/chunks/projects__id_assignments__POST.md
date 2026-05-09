## POST /projects/:id/assignments
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Assign a user to a project by creating a new project assignment and retrieving the corresponding project and topic information. Business logic includes validating user permissions and ensuring a unique project assignment is created.

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| dto | `AssignUserDto` | body |

### Request Body Fields
**AssignUserDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `userId` | `number` | Yes | 3 |
| `startDate` | `string` | No | 2026-01-01 |
| `endDate` | `string` | No | 2026-12-31 |

### Response
The endpoint responds with a 201 status code when the user is assigned successfully.

### Execution Flow
`assignUser()` → `assignUser()` → `projectAssignment.create`, `project.findUnique`, `topic.findMany`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN, MANAGER. This endpoint assumes that the provided project ID is valid and exists in the database. Additionally, ensure that the assignment is valid and follows business rules for project and topic relationships.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L100)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:49:23.492Z
