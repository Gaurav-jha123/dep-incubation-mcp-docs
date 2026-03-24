import type { User, Topic } from '../components/types';
import type { QueryFilter } from '../components/SkillMatrixQueryBuilder';

export interface SkillMatrixData {
  users: User[];
  topics: Topic[];
  skills: { userId: string; topicId: string; value: number }[];
}

export interface FilteredData {
  users: User[];
  topics: Topic[];
  skills: { userId: string; topicId: string; value: number }[];
}

/**
 * Helper function to check if a user/topic/skill combination matches query filters
 */
export function matchesQueryFilters(
  user: User, 
  topic: Topic, 
  skill: { value: number } | undefined,
  queryFilters: QueryFilter[]
): boolean {
  if (queryFilters.length === 0) return true;
  
  return queryFilters.every(filter => {
    switch (filter.type) {
      case 'user': {
        const userName = user.name.toLowerCase();
        const userValue = filter.value.toString().toLowerCase();
        if (filter.operator === 'contains') {
          return userName.includes(userValue);
        } else if (filter.operator === 'equals') {
          return userName === userValue;
        }
        break;
      }
        
      case 'topic': {
        const topicName = topic.label.toLowerCase();
        const topicValue = filter.value.toString().toLowerCase();
        if (filter.operator === 'contains') {
          return topicName.includes(topicValue);
        } else if (filter.operator === 'equals') {
          return topicName === topicValue;
        }
        break;
      }
        
      case 'score': {
        if (!skill) return false;
        const scoreValue = typeof filter.value === 'number' ? filter.value : parseInt(filter.value.toString());
        if (filter.operator === 'equals') {
          return skill.value === scoreValue;
        } else if (filter.operator === 'greater_than') {
          return skill.value > scoreValue;
        } else if (filter.operator === 'less_than') {
          return skill.value < scoreValue;
        } else if (filter.operator === 'between' && filter.value2 !== undefined) {
          const value2 = typeof filter.value2 === 'number' ? filter.value2 : parseInt(String(filter.value2));
          return skill.value >= scoreValue && skill.value <= value2;
        }
        break;
      }
    }
    return false;
  });
}

/**
 * Apply score filters to a skill value
 */
export function matchesScoreFilters(skillValue: number, scoreFilters: string[]): boolean {
  if (scoreFilters.length === 0) return true;
  
  return scoreFilters.some((filter) => {
    if (filter === "above80") return skillValue >= 80;
    if (filter === "above50") return skillValue >= 50;
    if (filter === "below50") return skillValue < 50;
    return true;
  });
}

/**
 * Apply all filters to skill matrix data
 */
export function applySkillMatrixFilters(
  skillMatrix: SkillMatrixData,
  users: User[],
  topics: Topic[],
  selectedUsers: string[],
  selectedTopics: string[],
  scoreFilters: string[],
  queryFilters: QueryFilter[]
): FilteredData {
  const filteredUsers = users.filter((user) => {
    // Apply traditional user filters
    const traditionalMatch = selectedUsers.length === 0 || selectedUsers.includes(user.id);
    
    // Apply query filters - check if user matches any query filter
    let queryMatch = true;
    if (queryFilters.length > 0) {
      // For user filtering, we need to check if any topic combination works
      queryMatch = topics.some(topic => {
        const skill = skillMatrix.skills.find(s => s.userId === user.id && s.topicId === topic.id);
        return matchesQueryFilters(user, topic, skill, queryFilters);
      });
    }
    
    return traditionalMatch && queryMatch;
  });

  const filteredTopics = topics.filter((topic) => {
    // Only apply traditional topic filters (column visibility controlled by checkboxes)
    // Query filters should NOT hide columns, only filter row data
    return selectedTopics.length === 0 || selectedTopics.includes(topic.id);
  });

  const skills = skillMatrix.skills.filter((skill) => {
    const user = users.find(u => u.id === skill.userId);
    const topic = topics.find(t => t.id === skill.topicId);
    
    if (!user || !topic) return false;

    const userMatch = selectedUsers.length === 0 || selectedUsers.includes(skill.userId);
    const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(skill.topicId);
    const scoreMatch = matchesScoreFilters(skill.value, scoreFilters);
    const queryMatch = matchesQueryFilters(user, topic, skill, queryFilters);

    return userMatch && topicMatch && scoreMatch && queryMatch;
  });

  return {
    users: filteredUsers,
    topics: filteredTopics,
    skills,
  };
}