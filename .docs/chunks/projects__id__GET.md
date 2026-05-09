## GET /projects/:id
**Module:** projects | **Operation:** 📖 read | **Confidence:** [█████████░ 90/100]

### What it does
Get project by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
Project with full details including skills and assignments

### Execution Flow
`findOne()` → `findOne()` → `project.findUnique`, `topic.findMany`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |

### Business Logic
The business logic for this operation retrieves a project by its unique ID, including its associated skills and topics. It does this by using `project.findUnique` to query the Prisma database and fetching related topics with `topic.findMany`. If the project is not found, a `NotFoundException` is thrown.

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |

### Notes
Requires JwtAuthGuard + RolesGuard. This operation assumes that the provided project ID is unique and valid, and does not check for any additional constraints. It's also worth noting that the project's details are fetched with a single Prisma call, which could potentially be optimized for performance-critical scenarios.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L51)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:48:20.751Z
