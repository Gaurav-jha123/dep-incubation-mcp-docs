import { useMemo } from "react";
import { useSkillMatrix } from "@/services/hooks/query/useSkillMatrix";
import type { UserPerformance } from "../types";

const TopPerformers = () => {
  const { skillMatrixData: skillMatrix } = useSkillMatrix();

  const topPerformers = useMemo(() => {
    // Calculate performance metrics for each user
    const userPerformances: UserPerformance[] = skillMatrix.users.map((user) => {
      const userSkills = skillMatrix.skills.filter((skill) => skill.userId === user.id);
      
      const averageScore = userSkills.length > 0 
        ? userSkills.reduce((sum, skill) => sum + skill.value, 0) / userSkills.length 
        : 0;
      
      // Get top 3 skills for this user
      const topSkills = userSkills
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map((skill) => ({
          topic: skillMatrix.topics.find((t) => t.id === skill.topicId)?.label || skill.topicId,
          score: skill.value,
        }));

      return {
        userId: user.id,
        name: user.name,
        averageScore: Math.round(averageScore * 10) / 10,
        totalSkills: userSkills.length,
        topSkills,
      };
    });

    // Sort by average score and return top 5
    return userPerformances
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
  }, [skillMatrix]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700";
    if (score >= 60) return "text-blue-700"; 
    if (score >= 40) return "text-amber-700";
    return "text-rose-700";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/50";
    if (score >= 60) return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50";
    if (score >= 40) return "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/50";
    return "bg-gradient-to-r from-rose-500/20 to-rose-600/20 border-rose-500/50";
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"; // Gold
    if (index === 1) return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"; // Silver
    if (index === 2) return "bg-gradient-to-r from-orange-400 to-orange-500 text-white"; // Bronze
    return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "⭐";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🏆 Top Performers
        </h2>
      </div>
      
      <div className="space-y-3">
        {topPerformers.map((performer, index) => (
          <div
            key={performer.userId}
            className={`relative p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-200 ${getScoreBg(performer.averageScore)}`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar and Rank */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-md ${getRankColor(index)}`}>
                  {getInitials(performer.name)}
                </div>
                <div className="text-lg">{getRankIcon(index)}</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{performer.name}</h3>
                    <p className="text-sm text-muted-foreground">{performer.totalSkills} skills assessed</p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${getScoreBg(performer.averageScore)} ${getScoreColor(performer.averageScore)}`}>
                      {performer.averageScore}/100
                    </div>
                  </div>
                </div>

                {/* Top Skills */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {performer.topSkills.map((skill, skillIndex) => {
                      const isTopSkill = skillIndex === 0;
                      return (
                        <div
                          key={skillIndex}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            isTopSkill 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                              : 'bg-card/70 text-foreground border border-border'
                          }`}
                        >
                          <span className="truncate max-w-[80px]">{skill.topic}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                            isTopSkill ? 'bg-white/20' : getScoreColor(skill.score)
                          }`}>
                            {skill.score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;