## DELETE /skill-matrix/:id
**Module:** skill-matrix | **Operation:** 🔀 mixed | **Confidence:** [█████████░ 90/100]

### What it does
Delete a skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
Skill matrix entry deleted successfully

### Execution Flow
`remove()` → `remove()` → `skillMatrix.delete`, `skillMatrix.findUnique`

### Error Conditions
| Exception |
|-----------|
| `ForbiddenException` |

### Business Logic
The `skills-matrix.delete` operation is called to permanently delete a skill matrix entry. Before deletion, the `skillMatrix.findUnique` operation checks if the entry exists. If the deletion is not permitted (i.e., the user is not the owner), a `ForbiddenException` is thrown, displaying a 403 status code.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Forbidden — not your entry |
| 404 | Skill matrix entry not found |

### Notes
Requires JwtAuthGuard. This endpoint is subject to authorization checks and Prisma operations. It is essential to handle edge cases where a user attempts to delete a non-existent or unauthorized entry.
### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L87)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:51:13.339Z
