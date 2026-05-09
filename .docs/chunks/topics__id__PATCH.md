## PATCH /topics/:id
**Module:** topics | **Operation:** 🔀 mixed | **Confidence:** [████████░░ 80/100]

### What it does
Update topic

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |
| dto | `UpdateTopicDto` | body |

### Request Body Fields
**UpdateTopicDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `label` | `string` | No | JavaScript |
| `description` | `string` | No | Core concepts of JS like closures, promises, etc. |

### Response
No response information provided.

### Execution Flow
`update()` → `update()` → `topic.update`, `topic.findUnique`

### Business Logic
The `/topics/:id` endpoint calls the `update()` service method, which performs a Prisma operation to update the topic with the provided `id` using `topic.update` and checks if the topic exists using `topic.findUnique`. If the topic is found, the update operation will succeed, otherwise, it will throw an error. The endpoint is secured by JwtAuthGuard and RolesGuard, requiring the ADMIN role for access.

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN. Note any additional edge cases.
### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L59)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:52:30.995Z
