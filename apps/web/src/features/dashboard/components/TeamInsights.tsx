import { useMemo } from "react";
import skillMatrix from "@/mocks/skillMatrix";
import type { SkillGap, TeamInsight } from "../types";

const TeamInsights = () => {
  const getSkillImpact = (skillId: string): string => {
    const impactMap: Record<string, string> = {
      'react': 'Core Frontend Technology',
      'typescript': 'Type Safety & Scale',
      'nextjs': 'Modern React Framework',
      'test_coverage': 'Quality Assurance',
      'design_patterns': 'Code Architecture',
      'problem_solving': 'Foundation Skill',
      'vcs_git': 'Version Control Essential',
      'build_tools': 'Development Workflow',
      'state_management': 'Complex App Management',
      'ui_toolkit': 'Component Libraries',
    };
    return impactMap[skillId] || 'Professional Development';
  };

  const { skillGaps, teamInsights, teamStats } = useMemo(() => {
    // Calculate skill gaps
    const gaps: SkillGap[] = skillMatrix.topics.map((topic) => {
      const skills = skillMatrix.skills.filter((skill) => skill.topicId === topic.id);
      const averageScore = skills.length > 0 
        ? skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length 
        : 0;
      
      const expertCount = skills.filter((skill) => skill.value >= 80).length;
      const totalAssessed = skills.length;

      let urgency: 'critical' | 'high' | 'medium' = 'medium';
      if (averageScore < 40 || (expertCount === 0 && totalAssessed > 8)) urgency = 'critical';
      else if (averageScore < 55 || expertCount < 2) urgency = 'high';

      return {
        topic: topic.label,
        averageScore: Math.round(averageScore),
        expertCount,
        totalAssessed,
        urgency,
        impact: getSkillImpact(topic.id),
      };
    }).sort((a, b) => a.averageScore - b.averageScore);

    // Generate team insights
    const insights: TeamInsight[] = [];

    // Critical skill gaps
    const criticalGaps = gaps.filter(gap => gap.urgency === 'critical').slice(0, 2);
    criticalGaps.forEach(gap => {
      insights.push({
        type: 'gap',
        title: 'Critical Skill Gap',
        description: `${gap.topic} needs immediate attention`,
        value: `${gap.averageScore}/100 avg`,
        icon: '🚨',
        color: 'bg-red-100 border-red-300 text-red-800'
      });
    });

    // Team strengths
    const strengths = gaps.filter(gap => gap.averageScore >= 70 && gap.expertCount >= 3).slice(0, 2);
    strengths.forEach(strength => {
      insights.push({
        type: 'strength',
        title: 'Team Strength',
        description: `Strong in ${strength.topic}`,
        value: `${strength.expertCount} experts`,
        icon: '💪',
        color: 'bg-green-100 border-green-300 text-green-800'
      });
    });

    // Bus factor risks (skills with only 1 expert)
    const risks = gaps.filter(gap => gap.expertCount === 1 && gap.averageScore >= 60).slice(0, 2);
    risks.forEach(risk => {
      insights.push({
        type: 'risk',
        title: 'Bus Factor Risk',
        description: `Only 1 expert in ${risk.topic}`,
        value: 'Single point of failure',
        icon: '⚠️',
        color: 'bg-orange-100 border-orange-300 text-orange-800'
      });
    });

    // Team statistics
    const allScores = skillMatrix.skills.map(s => s.value);
    const teamStats = {
      totalExperts: skillMatrix.skills.filter(s => s.value >= 80).length,
      totalBeginners: skillMatrix.skills.filter(s => s.value < 40).length,
      averageTeamScore: Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length),
      skillSpread: Math.round(Math.max(...allScores) - Math.min(...allScores)),
    };

    return {
      skillGaps: gaps.slice(0, 5),
      teamInsights: insights.slice(0, 6),
      teamStats,
    };
  }, []);


  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          🎯 Team Insights & Gaps
        </h2>
      </div>

      {/* Team Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌟</span>
            <div>
              <div className="text-sm font-bold text-emerald-800">{teamStats.totalExperts}</div>
              <div className="text-xs text-emerald-600">Expert Skills</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div>
              <div className="text-sm font-bold text-blue-800">{teamStats.averageTeamScore}/100</div>
              <div className="text-xs text-blue-600">Team Average</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <div className="text-sm font-bold text-amber-800">{teamStats.skillSpread}</div>
              <div className="text-xs text-amber-600">Score Range</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-3 border border-rose-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            <div>
              <div className="text-sm font-bold text-rose-800">{teamStats.totalBeginners}</div>
              <div className="text-xs text-rose-600">Need Training</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {teamInsights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg border-2 ${insight.color}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl">{insight.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                <p className="text-sm mb-2">{insight.description}</p>
                <div className="text-xs font-medium opacity-75">{insight.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Skills List */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span>🔥</span> Priority Skills to Address
        </h3>
        <div className="space-y-2">
          {skillGaps.map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${getUrgencyColor(gap.urgency)}`} />
                <div>
                  <h4 className="text-sm font-medium text-foreground">{gap.topic}</h4>
                  <p className="text-xs text-muted-foreground">{gap.impact}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-foreground">{gap.averageScore}<span className="text-muted-foreground">/100</span></div>
                <div className="text-xs text-muted-foreground">{gap.expertCount} experts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamInsights;