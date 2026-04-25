## Model: User
**DB Table:** `users`

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
| `id` | `Int` | No | @id @default(autoincrement()) |
| `name` | `String` | No | — |
| `email` | `String` | No | @unique |
| `password` | `String` | No | — |
| `role` | `Role` | No | @default(EMPLOYEE) |
| `createdAt` | `DateTime` | No | @default(now()) @map("created_at") |
| `updatedAt` | `DateTime` | No | @updatedAt @map("updated_at") |

### Relations
- `skillMatrix` → `SkillMatrix[]`
- `assignments` → `ProjectAssignment[]`
