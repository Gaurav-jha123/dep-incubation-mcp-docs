import { useMemo } from "react";
import skillMatrix from "@/mocks/skillMatrix";
import type { SkillCoverageData } from "../types";

const SkillCoverage = () => {
  const skillCoverageData = useMemo(() => {
    const data: SkillCoverageData[] = skillMatrix.topics.map((topic) => {
      const skillsForTopic = skillMatrix.skills.filter((skill) => skill.topicId === topic.id);
      
      const experts = skillsForTopic.filter((skill) => skill.value >= 80).length;
      const advanced = skillsForTopic.filter((skill) => skill.value >= 60 && skill.value < 80).length;
      const intermediate = skillsForTopic.filter((skill) => skill.value >= 40 && skill.value < 60).length;
      const beginners = skillsForTopic.filter((skill) => skill.value < 40).length;
      
      const totalUsers = skillsForTopic.length;
      const averageScore = totalUsers > 0 
        ? skillsForTopic.reduce((sum, skill) => sum + skill.value, 0) / totalUsers 
        : 0;

      // Risk level based on expert coverage and average score
      const expertPercentage = totalUsers > 0 ? (experts / totalUsers) * 100 : 0;
      let riskLevel: 'high' | 'medium' | 'low' = 'low';
      
      if (expertPercentage < 20 && averageScore < 50) riskLevel = 'high';
      else if (expertPercentage < 40 && averageScore < 65) riskLevel = 'medium';

      return {
        topic: topic.label,
        topicId: topic.id,
        experts,
        advanced,
        intermediate,
        beginners,
        totalUsers,
        averageScore: Math.round(averageScore),
        riskLevel,
      };
    });

    return data.sort((a, b) => b.averageScore - a.averageScore);
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return '✅';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          📊 Skill Coverage Analysis
        </h2>
      </div>

      <div className="space-y-4">
        {skillCoverageData.slice(0, 8).map((skill) => (
          <div key={skill.topicId} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getRiskIcon(skill.riskLevel)}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{skill.topic}</h3>
                  <p className="text-xs text-gray-500">{skill.totalUsers} team members assessed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(skill.riskLevel)}`}>
                  {skill.riskLevel.toUpperCase()}
                </span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">{skill.averageScore}/100</div>
                  <div className="text-xs text-gray-500">avg</div>
                </div>
              </div>
            </div>

            {/* Skill level distribution bar */}
            <div className="mb-2">
              <div className="flex text-xs text-gray-600 justify-between mb-1">
                <span>Experts</span>
                <span>Advanced</span>
                <span>Intermediate</span>
                <span>Beginners</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  {skill.totalUsers > 0 && (
                    <>
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500"
                        style={{ width: `${(skill.experts / skill.totalUsers) * 100}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-500"
                        style={{ width: `${(skill.advanced / skill.totalUsers) * 100}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-500"
                        style={{ width: `${(skill.intermediate / skill.totalUsers) * 100}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-rose-400 to-rose-500"
                        style={{ width: `${(skill.beginners / skill.totalUsers) * 100}%` }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Count badges */}
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                {skill.experts}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {skill.advanced}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                {skill.intermediate}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                {skill.beginners}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillCoverage;