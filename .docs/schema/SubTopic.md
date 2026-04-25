## Model: SubTopic
**DB Table:** `subtopics`

### Fields
| Field | Type | Optional | Attributes |
|-------|------|----------|------------|
| `id` | `Int` | No | @id @default(autoincrement()) |
| `label` | `String` | No | — |
| `topicId` | `Int` | No | @map("topic_id") |
| `createdAt` | `DateTime` | No | @default(now()) @map("created_at") |
| `updatedAt` | `DateTime` | No | @updatedAt @map("updated_at") |

### Relations
- `topic` → `Topic`
