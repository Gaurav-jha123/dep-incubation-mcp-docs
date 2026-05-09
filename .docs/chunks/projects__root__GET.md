## GET /projects
**Module:** projects | **Operation:** 📖 read | **Confidence:** [███████░░░ 70/100]

### What it does
Get all projects

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
List of projects with skills and assignment count

### Execution Flow
`findAll()` → `findAll()` → `project.findMany`, `topic.findMany`

### Business Logic
The service method `findAll()` is called in a recursive manner, first executing `findAll()` and then the `project.findMany` Prisma operation to retrieve a list of projects. Additionally, the `topic.findMany` Prisma operation is executed to fetch related topics. The method does not enforce any transactions, and it does not throw any custom errors. In case of database-related errors, the default error handling mechanism of Prisma comes into play and returns a 500 Internal Server Error response.

### Notes
Requires JwtAuthGuard + RolesGuard. Note any additional edge cases.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L40)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:48:04.854Z
