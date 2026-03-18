import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import skillMatrix from "@/mocks/skillMatrix";

const SkillDistribution = () => {
  /* skill range groups */
  const ranges = [
    { name: "Beginner (0-40)", min: 0, max: 40 },
    { name: "Intermediate (41-60)", min: 41, max: 60 },
    { name: "Advanced (61-80)", min: 61, max: 80 },
    { name: "Expert (81-100)", min: 81, max: 100 },
  ];

  /* chart colors */
  const colors = ["#4f46e5", "#16a34a", "#ca8a04", "#dc2626"];

  /* prepare pie chart data */
  const chartData = ranges.map((range, index) => {
    const count = skillMatrix.skills.filter(
      (skill) => skill.value >= range.min && skill.value <= range.max,
    ).length;

    return {
      name: range.name,
      value: count,
      fill: colors[index],
    };
  });

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
          <span className="text-white text-lg">📊</span>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Skill Distribution
        </h2>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
              cx="50%"
              cy="50%"
            />
            <Tooltip />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillDistribution;