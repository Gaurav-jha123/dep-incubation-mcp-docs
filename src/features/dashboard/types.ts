// Dashboard component types

export interface UserPerformance {
  userId: string;
  name: string;
  averageScore: number;
  totalSkills: number;
  topSkills: Array<{ topic: string; score: number }>;
}

export interface SkillCoverageData {
  topic: string;
  topicId: string;
  experts: number; // 80+
  advanced: number; // 60-79
  intermediate: number; // 40-59
  beginners: number; // 0-39
  totalUsers: number;
  averageScore: number;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface LearningRecommendation {
  userId: string;
  userName: string;
  recommendations: Array<{
    topic: string;
    currentScore: number;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  averageScore: number;
}

export interface SkillGap {
  topic: string;
  averageScore: number;
  expertCount: number;
  totalAssessed: number;
  urgency: 'critical' | 'high' | 'medium';
  impact: string;
}

export interface TeamInsight {
  type: 'gap' | 'strength' | 'risk';
  title: string;
  description: string;
  value: string;
  icon: string;
  color: string;
}