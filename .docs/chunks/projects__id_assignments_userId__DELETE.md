## DELETE /projects/:id/assignments/:userId
**Module:** projects

### What it does
Remove a user from a project

### Request
| Param | Type | Source |
|-------|------|--------|
| `id` | `number` | param |
| `userId` | `number` | param |

### Response
User removed

### Business Logic
`removeUser()` — Calls `projectAssignment.delete`, `project.findUnique`, `topic.findMany`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN, MANAGER

### Errors
| Status | Description |
|--------|-------------|
| 404 | Project not found |
### Notes
Requires JWT authentication. See module guards for role requirements.
