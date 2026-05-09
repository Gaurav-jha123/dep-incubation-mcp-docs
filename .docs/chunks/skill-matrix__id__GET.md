## GET /skill-matrix/:id
**Module:** skill-matrix | **Operation:** 📖 read | **Confidence:** [█████████░ 90/100]

### What it does
Get a skill matrix entry by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
Skill matrix entry found

### Execution Flow
`findOne()` → `findOne()` → `skillMatrix.findUnique`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |

### Business Logic
This API endpoint retrieves a skill matrix entry from the database using Prisma's `findUnique` method on the `skillMatrix` model. The business rule is that a skill matrix entry must exist in the database. If the entry is not found, a `NotFoundException` is thrown.

### Errors
| Status | Description |
|--------|-------------|
| 404 | Skill matrix entry not found |

### Notes
Requires JwtAuthGuard. Edge case: the `findOne()` method is called twice in the execution flow, which may be an optimization or a bug. Additional investigation is required to determine the necessity of this repeated call.
### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L45)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:50:26.168Z
