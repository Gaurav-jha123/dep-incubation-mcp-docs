## POST /skill-matrix
**Module:** skill-matrix | **Operation:** ✏️ write | **Confidence:** [██████████ 100/100]

### What it does
Create a new skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `CreateSkillMatrixDto` | body |

### Request Body Fields
**CreateSkillMatrixDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `topicId` | `number` | Yes | 1 |
| `value` | `number` | Yes | 75 |

### Response
Skill matrix entry created successfully

### Execution Flow
`create()` → `create()` → `skillMatrix.create`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |

### Business Logic
When the `create()` method is called, it performs a Prisma operation `skillMatrix.create` to persist the new skill matrix entry. If a duplicate entry is attempted to be created, a `ConflictException` is thrown. Error handling is implemented to catch and handle invalid input, including field-specific validation and conflict errors.

### Errors
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |

### Notes
Requires JwtAuthGuard.
### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L54)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:50:41.971Z
