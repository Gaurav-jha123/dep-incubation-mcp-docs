## GET /skill-matrix
**Module:** skill-matrix | **Operation:** 📖 read | **Confidence:** ██████████ 100/100

### What it does
Get all skill matrix entries

### Request
| Param | Type | Source |
|-------|------|--------|
| `query` | `PaginationQueryDto` | query |

### Response
List of skill matrix entries

### Execution Flow
`findAll()` → `findAll()` → `skillMatrix.findMany`, `skillMatrix.count`
### Business Logic
`findAll()` — Calls `skillMatrix.findMany`, `skillMatrix.count`.

### Auth
**Guards:** JwtAuthGuard
### Notes
Requires JwtAuthGuard.

### Source
[apps/api/src/modules/skill-matrix/skill-matrix.controller.ts](apps/api/src/modules/skill-matrix/skill-matrix.controller.ts#L34)
