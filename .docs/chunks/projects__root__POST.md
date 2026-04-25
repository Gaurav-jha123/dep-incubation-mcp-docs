## POST /projects
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** ██████████ 100/100

### What it does
Create project

### Request
| Param | Type | Source |
|-------|------|--------|
| `dto` | `CreateProjectDto` | body |

### Request Body Fields
**CreateProjectDto**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `code` | `string` | Yes | UKG-HPAY |
| `name` | `string` | Yes | Client Portal Alpha |
| `description` | `string` | No | Frontend portal for Acme Corp |
| `type` | `ProjectType` | Yes | ProjectType.CLIENT |
| `status` | `ProjectStatus` | No | ProjectStatus.ACTIVE |
| `clientName` | `string` | No | Acme Corp |
| `startDate` | `string` | No | 2026-01-01 |
| `endDate` | `string` | No | 2026-12-31 |
| `skillIds` | `number[]` | No | — |
| `userIds` | `number[]` | No | — |

### Response
Project created

### Execution Flow
`create()` → `create()` → `project.create`, `projectAssignment.createMany`, `project.findUnique`, `topic.findMany`

### Error Conditions
| Exception |
|-----------|
| `ConflictException` |
### Business Logic
`create()` — Calls `project.create`, `projectAssignment.createMany`, `project.findUnique`, `topic.findMany`. May throw: ConflictException.

### Auth
**Guards:** JwtAuthGuard, RolesGuard
**Required roles:** ADMIN, MANAGER

> ⚠️ **Consistency risk (low):** multiple writes without `$transaction` detected.
### Notes
Requires JwtAuthGuard + RolesGuard. Required roles: ADMIN, MANAGER.

### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L64)
