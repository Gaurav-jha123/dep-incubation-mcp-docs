## DELETE /topics/:id
**Module:** topics | **Operation:** 🔀 mixed | **Confidence:** [███████░░░ 70/100]

### What it does
Delete a topic with the specified `id`.

### Request
| Param | Type | Source |
|-------|------|--------|
| id | `number` | param |

### Response
No response is currently documented.

### Execution Flow
`remove()` → `remove()` → `topic.delete`, `topic.findUnique`

### Business Logic
The `remove()` method is called, which executes `topic.delete` to delete the topic from the database. Additionally, `topic.findUnique` is also used to retrieve the topic before deletion, possibly for auditing or caching purposes. If the topic with the specified `id` does not exist, the deletion operation will fail, but no specific error is documented. The method does not support transactions.

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.
### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L67)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:52:46.627Z
