## GET /skill-matrix
**Module:** skill-matrix | **Operation:** 📖 read | **Confidence:** [██████████ 100/100]

### What it does
Get all skill matrix entries

### Request
| Param | Type | Source |
|-------|------|--------|
| query | `PaginationQueryDto` | query |

### Response
List of skill matrix entries

### Execution Flow
`findAll()` → `findAll()` → `skillMatrix.findMany`, `skillMatrix.count`

### Business Logic
The `findAll()` method calls two Prisma operations: `skillMatrix.findMany` to retrieve all skill matrix entries and `skillMatrix.count` to retrieve the total count of entries. It does not handle errors, but the JwtAuthGuard ensures that only authenticated users can access this endpoint. If the query parameter is invalid (e.g., has an invalid page or limit), it may not throw any specific error, but it will return an HTTP response with a non-specific error message.

### Notes
Requires JwtAuthGuard.
### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L34)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:50:10.395Z
