## POST /sub-topics
**Module:** sub-topics | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Create sub-topic

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `CreateSubTopicDto` | body |

### Request Body Fields
**CreateSubTopicDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `topicId` | `number` | Yes | 1 |
| `subTopics` | `string[]` | Yes | — |

### Response
Sub-topic created

### Execution Flow
`create()` → `create()` → `subTopic.findFirst`, `subTopic.create`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |

### Business Logic
The `create()` method performs a `subTopic.findFirst` operation to retrieve existing sub-topics, followed by a `subTopic.create` operation to insert the new sub-topic. This process throws a `ConflictException` if there is a duplicate sub-topic entry with the same topic Id. The `ConflictException` is thrown as a result of the Prisma `subTopic.create` operation.

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.
### Source
[apps/api/src/modules/sub-topics/sub-topics.controller.ts](apps/api/src/modules/sub-topics/sub-topics.controller.ts#L21)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:51:28.932Z
