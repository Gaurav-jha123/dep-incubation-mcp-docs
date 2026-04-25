## Model: ProjectAssignment
**DB Table:** `project_assignments`

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
| `id` | `Int` | No | @id @default(autoincrement()) |
| `userId` | `Int` | No | @map("user_id") |
| `projectId` | `Int` | No | @map("project_id") |
| `status` | `AssignmentStatus` | No | @default(PRESELECTED) |
| `startDate` | `DateTime?` | Yes | @map("start_date") |
| `endDate` | `DateTime?` | Yes | @map("end_date") |
| `createdAt` | `DateTime` | No | @default(now()) @map("created_at") |
| `updatedAt` | `DateTime` | No | @updatedAt @map("updated_at") |

### Relations
- `user` → `User`
- `project` → `Project`

### Constraints & Indexes
- Unique: `userId, projectId`
