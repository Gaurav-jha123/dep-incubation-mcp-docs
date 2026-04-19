## POST /skill-matrix
**Module:** skill-matrix

### What it does
Create a new skill matrix entry

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateSkillMatrixDto` | body |

### Response
Skill matrix entry created successfully

### Business Logic
`create()` — Calls `skillMatrix.create`. May throw: ConflictException.

### Auth
**Guards:** JwtAuthGuard

### Errors
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
### Notes
Requires JWT authentication. See module guards for role requirements.
