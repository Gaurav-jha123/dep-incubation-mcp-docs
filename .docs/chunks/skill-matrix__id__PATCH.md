## PATCH /skill-matrix/:id
**Module:** skill-matrix | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Update a skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| dto | `UpdateSkillMatrixDto` | body |

### Request Body Fields
**UpdateSkillMatrixDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `topicId` | `number` | No | 1 |
| `value` | `number` | No | 85 |

### Response
Skill matrix entry updated successfully

### Execution Flow
`update()` → `update()` → `skillMatrix.update`, `skillMatrix.findUnique`

### Error Conditions
| Exception |
|-----------|
| `ForbiddenException` |

### Business Logic
The `update()` service method updates a skill matrix entry by invoking `skillMatrix.update` and `skillMatrix.findUnique` Prisma operations. The `update()` method throws a `ForbiddenException` if the user lacks permission to update the skill matrix entry. Additionally, error handling is present to catch cases where the skill matrix entry is not found.

### Errors
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 403 | Forbidden — not your entry |
| 404 | Skill matrix entry not found |

### Notes
Requires JwtAuthGuard. This endpoint does not handle scenarios where the request body is malformed.
### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L69)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:50:57.576Z
