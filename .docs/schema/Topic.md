## Model: Topic
**DB Table:** `topics`

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
| `id` | `Int` | No | @id @default(autoincrement()) |
| `label` | `String` | No | — |
| `description` | `String?` | Yes | — |
| `createdAt` | `DateTime` | No | @default(now()) @map("created_at") |
| `updatedAt` | `DateTime` | No | @updatedAt @map("updated_at") |

### Relations
- `skillMatrix` → `SkillMatrix[]`
- `subTopics` → `SubTopic[]`
