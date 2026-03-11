// types.ts
export interface Topic {
  id: string;
  label: string;
}

export interface User {
  id: string;
  name: string;
}

export interface Skill {
  userId: string;
  topicId: string;
  value: number;
}

export interface SkillMatrixData {
  topics: Topic[];
  users: User[];
  skills: Skill[];
}