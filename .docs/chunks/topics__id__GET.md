## GET /topics/:id
**Module:** topics | **Operation:** 📖 read | **Confidence:** [█████████░ 90/100]

### What it does
Get topic by ID

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
Topic found

### Execution Flow
`findOne()` → `findOne()` → `topic.findUnique`

### Error Conditions
| Exception |
|-----------|
| `NotFoundException` |

### Business Logic
This endpoint executes the `findOne` service method which calls the `topic.findUnique` Prisma operation to retrieve a specific topic by ID. If the topic is not found, the `NotFoundException` is thrown. The endpoint enforces authentication and authorization using the JwtAuthGuard and RolesGuard.

### Errors
| Status | Description |
|--------|-------------|
| 404 | Topic not found |

### Notes
Requires JwtAuthGuard + RolesGuard. Note any additional edge cases.
### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L42)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:51:59.950Z
