## POST /topics
**Module:** topics | **Operation:** ✏️ write | **Confidence:** ██████████ 100/100

### What it does
Create topic

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateTopicDto` | body |

### Request Body Fields
**CreateTopicDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `label` | `string` | Yes | — |
| `description` | `string` | No | — |

### Response
Topic created

### Execution Flow
`create()` → `create()` → `topic.create`
### Business Logic
`create()` — Calls `topic.create`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.

### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L51)
