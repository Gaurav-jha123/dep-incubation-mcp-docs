## POST /sub-topics
**Module:** sub-topics | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Create sub-topic

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateSubTopicDto` | body |

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
`create()` — Calls `subTopic.findFirst`, `subTopic.create`. May throw: ConflictException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/sub-topics/sub-topics.controller.ts](apps/api/src/modules/sub-topics/sub-topics.controller.ts#L21)
