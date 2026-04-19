## POST /projects/:id/assignments
**Module:** projects

### What it does
Assign a user to a project

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `dto` | `AssignUserDto` | body |

### Response
User assigned

### Business Logic
`assignUser()` — Calls `projectAssignment.create`, `project.findUnique`, `topic.findMany`. May throw: ConflictException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN, MANAGER

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |
### Notes
Requires JWT authentication. See module guards for role requirements.
