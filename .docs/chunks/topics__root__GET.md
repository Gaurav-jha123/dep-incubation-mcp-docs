## GET /topics
**Module:** topics | **Operation:** 📖 read | **Confidence:** [██████████ 100/100]

### What it does
Get all topics

### Request
| Param | Type | Source |
|=======|======|========|
| query | `PaginationQueryDto` | query |

### Response
List of topics

### Execution Flow
`findAll()` → `findAll()` → `topic.findMany`, `topic.count`

### Business Logic
The `findAll()` method retrieves all topics from the database by calling `topic.findMany`. It also retrieves the total count of topics using `topic.count`. The method executes this logic within the context of a transaction if it's enabled. In case an error occurs during the execution, it's propagated as an error response. The pagination query parameters received with the request are used to determine the limit and offset of the topics to be returned.

### Notes
Requires JwtAuthGuard + RolesGuard.
### Source
[apps/api/src/modules/topics/topic.controller.ts](apps/api/src/modules/topics/topic.controller.ts#L35)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:51:44.479Z
