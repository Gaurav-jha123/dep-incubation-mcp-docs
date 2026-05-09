## POST /projects
**Module:** projects | **Operation:** 🔀 mixed | **Confidence:** [██████████ 100/100]

### What it does
Create project

### Request
| Param | Type | Source |
|-------|------|--------|
| dto | `CreateProjectDto` | body |

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
When creating a project, this endpoint performs the following database operations: it creates a new project using `project.create`, creates project assignments using `projectAssignment.createMany`, retrieves an existing project using `project.findUnique`, and retrieves related topics using `topic.findMany`. If a project with the same code already exists, a ConflictException is thrown. Required roles for this endpoint are ADMIN and MANAGER.
### Source
[apps/api/src/modules/projects/projects.controller.ts](apps/api/src/modules/projects/projects.controller.ts#L64)

---
### Provenance
🔧 **AST** (high confidence): route, method, guards, roles, parameters, response types, decorators
🤖 **LLM_GENERATED** (medium confidence): summary, business logic descriptions
🔍 **INFERRED** (medium confidence): execution flow, operation type, consistency analysis

**Last updated:** 2026-05-09T10:48:36.521Z
