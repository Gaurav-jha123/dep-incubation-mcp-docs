import { useMemo } from "react";
import skillMatrix from "@/mocks/skillMatrix";
import type { LearningRecommendation } from "../types";

const LearningRecommendations = () => {
  // Helper function to suggest related skills
  const getRelatedSkills = (skillId: string, userSkillIds: string[]): string[] => {
    const relatedSkillsMap: Record<string, string[]> = {
      'react': ['nextjs', 'typescript', 'state_management'],
      'nextjs': ['react', 'typescript'],
      'typescript': ['react', 'nextjs', 'build_tools'],
      'design_system': ['ui_toolkit', 'styling'],
      'ui_toolkit': ['design_system', 'styling'],
      'styling': ['design_system', 'ui_toolkit'],
      'state_management': ['react', 'form_management'],
      'build_tools': ['typescript', 'vcs_git'],
    };

    const related = relatedSkillsMap[skillId] || [];
    return related.filter(id => !userSkillIds.includes(id));
  };

  const learningData = useMemo(() => {
    const recommendations: LearningRecommendation[] = skillMatrix.users.map((user) => {
      const userSkills = skillMatrix.skills.filter((skill) => skill.userId === user.id);
      const averageScore = userSkills.length > 0 
        ? userSkills.reduce((sum, skill) => sum + skill.value, 0) / userSkills.length 
        : 0;

      // Find skills to improve based on different criteria
      const skillsToImprove = [];

      // 1. Low scoring skills (< 60) that could be improved
      const lowSkills = userSkills
        .filter((skill) => skill.value < 60 && skill.value > 0)
        .sort((a, b) => b.value - a.value) // Start with higher scores for quicker wins
        .slice(0, 2);

      lowSkills.forEach((skill) => {
        const topic = skillMatrix.topics.find((t) => t.id === skill.topicId);
        if (topic) {
          skillsToImprove.push({
            topic: topic.label,
            currentScore: skill.value,
            reason: skill.value < 40 ? "Foundation building needed" : "Close to next level",
            priority: skill.value >= 40 ? 'high' as const : 'medium' as const,
            category: "Skill Improvement"
          });
        }
      });

      // 2. Missing critical skills (skills user doesn't have but team does)
      const userSkillIds = userSkills.map(s => s.topicId);
      const missingSkills = skillMatrix.topics
        .filter((topic) => !userSkillIds.includes(topic.id))
        .slice(0, 1); // Just suggest one missing skill

      missingSkills.forEach((topic) => {
        // Check if this is a popular skill in the team
        const teamHasSkill = skillMatrix.skills.filter(s => s.topicId === topic.id).length;
        if (teamHasSkill > 5) {
          skillsToImprove.push({
            topic: topic.label,
            currentScore: 0,
            reason: "Team priority - many colleagues skilled",
            priority: 'medium' as const,
            category: "Knowledge Gap"
          });
        }
      });

      // 3. Complement existing strengths
      const strengths = userSkills
        .filter((skill) => skill.value >= 70)
        .sort((a, b) => b.value - a.value)
        .slice(0, 1);

      if (strengths.length > 0) {
        // Suggest complementary skills based on existing strengths
        const strongSkill = strengths[0];
        const relatedSkills = getRelatedSkills(strongSkill.topicId, userSkillIds);
        
        if (relatedSkills.length > 0) {
          const relatedTopic = skillMatrix.topics.find(t => t.id === relatedSkills[0]);
          if (relatedTopic) {
            skillsToImprove.push({
              topic: relatedTopic.label,
              currentScore: 0,
              reason: "Complements your strength in " + skillMatrix.topics.find(t => t.id === strongSkill.topicId)?.label,
              priority: 'low' as const,
              category: "Skill Synergy"
            });
          }
        }
      }

      return {
        userId: user.id,
        userName: user.name,
        recommendations: skillsToImprove.slice(0, 3),
        averageScore: Math.round(averageScore),
      };
    });

    // Return users with recommendations, sorted by those who need most help
    return recommendations
      .filter(user => user.recommendations.length > 0)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 6);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 border-rose-300 text-rose-800';
      case 'medium': return 'bg-amber-100 border-amber-300 text-amber-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Skill Improvement': return '📈';
      case 'Knowledge Gap': return '🎯';
      case 'Skill Synergy': return '🔄';
      default: return '💡';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          🎓 Learning Recommendations
        </h2>
      </div>

      <div className="space-y-4">
        {learningData.map((user) => (
          <div key={user.userId} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.userName}</h3>
                  <p className="text-xs text-gray-500">Avg Score: {user.averageScore}/100</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {user.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-400">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getCategoryIcon(rec.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800 text-sm">{rec.topic}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{rec.reason}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Current:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-400 to-purple-400 h-1.5 rounded-full"
                            style={{ width: `${rec.currentScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{rec.currentScore}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningRecommendations;