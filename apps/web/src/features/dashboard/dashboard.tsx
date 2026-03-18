import TopPerformers from "./components/TopPerformers";
import SkillCoverage from "./components/SkillCoverage";
import LearningRecommendations from "./components/LearningRecommendations";
import TeamInsights from "./components/TeamInsights";
import SkillDistribution from "./components/SkillDistribution";
import KPICards from "./components/KPICards";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 overflow-x-hidden">

        {/* Enhanced KPI Cards */}
        <KPICards />

        {/* Main Content - Masonry Layout */}
        <div className="columns-1 lg:columns-2 xl:columns-3 gap-8 space-y-8 overflow-x-hidden">
          
          {/* Skill Distribution Chart */}
          <div className="break-inside-avoid mb-8">
            <SkillDistribution />
          </div>

          {/* Team Insights - moved up for better positioning */}
          <div className="break-inside-avoid mb-8">
            <TeamInsights />
          </div>

          {/* Skill Coverage Analysis - moved up for better visibility */}
          <div className="break-inside-avoid mb-8">
            <SkillCoverage />
          </div>

          {/* Learning Recommendations */}
          <div className="break-inside-avoid mb-8">
            <LearningRecommendations />
          </div>

          {/* Top Performers */}
          <div className="break-inside-avoid mb-8">
            <TopPerformers />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
