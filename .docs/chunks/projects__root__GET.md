## GET /projects
**Module:** projects | **Operation:** 📖 read | **Confidence:** ███████░░░ 70/100

### What it does
Get all projects

### Request
| Param | Type | Source |
|-------|------|--------|
| — | — | — |

### Response
List of projects with skills and assignment count

### Execution Flow
`findAll()` → `findAll()` → `project.findMany`, `topic.findMany`
### Business Logic
`findAll()` — Calls `project.findMany`, `topic.findMany`.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
### Notes
Requires JwtAuthGuard + RolesGuard.

### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L40)
