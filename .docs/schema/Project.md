## Model: Project
**DB Table:** `projects`

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
| `id` | `Int` | No | @id @default(autoincrement()) |
| `code` | `String` | No | @unique |
| `name` | `String` | No | — |
| `description` | `String?` | Yes | — |
| `type` | `ProjectType` | No | — |
| `status` | `ProjectStatus` | No | @default(ACTIVE) |
| `clientName` | `String?` | Yes | @map("client_name") |
| `skillIds` | `Int[]` | No | @map("skill_ids") |
| `startDate` | `DateTime?` | Yes | @map("start_date") |
| `endDate` | `DateTime?` | Yes | @map("end_date") |
| `createdAt` | `DateTime` | No | @default(now()) @map("created_at") |
| `updatedAt` | `DateTime` | No | @updatedAt @map("updated_at") |

### Relations
- `assignments` → `ProjectAssignment[]`
