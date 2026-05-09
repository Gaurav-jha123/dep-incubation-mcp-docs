## GET /users
**Module:** users | **Operation:** 📖 read | **Confidence:** [███████░░░ 70/100]

### What it does
Get all users

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
List of users

### Execution Flow
`findAll()` → `findAll()` → `user.findMany`

### Business Logic
This endpoint executes a Prisma query to retrieve a list of all users. It calls the `findAll` method, which is implemented in the `users.service.ts` file and utilizes the `user.findMany` operation to fetch data from the database. The method does not handle transactions. If there are any errors during database operations, none are explicitly documented, indicating a moderate level of risk.

### Notes
Requires JwtAuthGuard + RolesGuard. Note that this endpoint can only be accessed by authenticated users with the necessary permissions.
### Source
[apps/api/src/modules/users/users.controller.ts](apps/api/src/modules/users/users.controller.ts#L33)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:53:02.111Z
