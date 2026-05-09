## POST /topics
**Module:** topics | **Operation:** ✏️ write | **Confidence:** [██████████ 100/100]

### What it does
Create topic

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `CreateTopicDto` | body |

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
The `create()` service method is called, which performs a Prisma operation of type `topic.create` to insert a new topic into the database. This operation creates a new topic with the provided `label` and optional `description`. If a topic with the same label already exists, an error is thrown. Error handling is performed by the guard services and service methods to ensure that only valid requests are processed, and invalid requests receive clear error messages.

### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN.
### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L51)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:52:15.455Z
