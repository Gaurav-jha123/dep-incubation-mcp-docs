# Skill Matrix Query Builder

## Overview
The Skill Matrix Query Builder is an advanced filtering component that allows users to create complex queries to filter skill matrix data based on topics, users, and skill scores.

## Features

### Quick Search
- **Text-based search**: Type in the search box to quickly find users or topics by name
- **Auto-detection**: Automatically searches both user names and topic names simultaneously
- **Real-time filtering**: Results update as you type

### Advanced Query Builder
- **Complex filters**: Create sophisticated filter combinations with multiple conditions
- **Multiple filter types**:
  - **Topic filters**: Search by topic name (contains/equals)
  - **User filters**: Search by user name (contains/equals) 
  - **Score filters**: Filter by skill score values (equals/greater than/less than/between)

### Filter Operations
- **Contains**: Partial text matching (case-insensitive)
- **Equals**: Exact text matching (case-insensitive)
- **Greater than**: For scores > specified value
- **Less than**: For scores < specified value  
- **Between**: For scores within a range

## How to Use

### Quick Search
1. Click the filters button (slider icon) in the top right of the skill matrix
2. Type in the "Quick search" field to find topics or users by name
3. Results automatically filter as you type

### Advanced Filtering
1. Click "Advanced" to expand the query builder
2. Click "Add Filter" to create a new filter condition
3. Configure each filter:
   - Select the **type** (Topic/User/Score)
   - Choose an **operator** (contains, equals, etc.)
   - Enter the **value** to search for
   - For "between" operations, enter a second value
4. Use multiple filters together (combined with AND logic)
5. Use the "Clear All" button to remove all filters

### Filter Management
- **Remove individual filters**: Click the X button on any filter badge
- **Clear all filters**: Use the "Clear All" button
- **View active filters**: See all active filters displayed as badges below the search

## Examples

### Example Queries
- **Find React experts**: Topic contains "react" AND Score greater than 80
- **Find specific user skills**: User equals "John Davis" AND Topic contains "javascript"  
- **Find intermediate skills**: Score between 50 and 80
- **Search multiple topics**: Topic contains "react" OR create multiple topic filters

### Integration with Existing Filters
- The query builder works alongside existing dropdown filters
- Traditional filters (user/topic dropdowns, score buttons) combine with query builder results
- All filters use AND logic - results must match ALL active conditions

## Technical Details

### Data Structure
```typescript
interface QueryFilter {
  id: string;
  type: 'topic' | 'user' | 'score';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  value2?: number; // for 'between' operator
}
```

### Component Location
- Main component: `src/features/skillMatrix/components/SkillMatrixQueryBuilder.tsx`
- Integrated into: `src/features/skillMatrix/components/SkillMatrixDrawer.tsx`
- Used by: `src/features/skillMatrix/SkillMatrix.tsx`

## Future Enhancements
- Save/load query presets
- Export filtered results
- OR logic between filter groups
- Date-based filtering for skill updates
- Skill level categories (Beginner/Intermediate/Advanced)