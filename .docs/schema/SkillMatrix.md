## Model: SkillMatrix
**DB Table:** `skill_matrix`

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
| `id` | `Int` | No | @id @default(autoincrement()) |
| `userId` | `Int` | No | @map("user_id") |
| `topicId` | `Int` | No | @map("topic_id") |
| `value` | `Int` | No | @map("skill_level") |
| `createdAt` | `DateTime` | No | @default(now()) @map("created_at") |
| `updatedAt` | `DateTime` | No | @updatedAt @map("updated_at") |

### Relations
- `user` → `User`
- `topic` → `Topic`

### Constraints & Indexes
- Unique: `userId, topicId`
- Index: `userId`
- Index: `topicId`
