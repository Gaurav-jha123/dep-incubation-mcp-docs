import skillMatrix from "@/mocks/skillMatrix";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const Dashboard = () => {

  /* totals */
  const totalUsers = skillMatrix.users.length;
  const totalTopics = skillMatrix.topics.length;
  const totalSkills = skillMatrix.skills.length;
  const avgSkillsPerUser = (totalSkills / totalUsers).toFixed(1);

  /* skill range groups */
  const ranges = [
    { name: "Beginner (0-40)", min: 0, max: 40 },
    { name: "Intermediate (41-60)", min: 41, max: 60 },
    { name: "Advanced (61-80)", min: 61, max: 80 },
    { name: "Expert (81-100)", min: 81, max: 100 }
  ];

  /* chart colors */
  const colors = [
    "#4f46e5",
    "#16a34a",
    "#ca8a04",
    "#dc2626"
  ];

  /* prepare pie chart data */
  const chartData = ranges.map((range, index) => {

    const count = skillMatrix.skills.filter(
      (skill) =>
        skill.value >= range.min &&
        skill.value <= range.max
    ).length;

    return {
      name: range.name,
      value: count,
      fill: colors[index]
    };

  });

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        Skill Matrix Dashboard
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold">{totalUsers}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Topics</p>
          <h2 className="text-3xl font-bold">{totalTopics}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Skills</p>
          <h2 className="text-3xl font-bold">{totalSkills}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Avg Skills / User</p>
          <h2 className="text-3xl font-bold">{avgSkillsPerUser}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Topics Covered</p>
          <h2 className="text-3xl font-bold">{totalTopics}</h2>
        </div>

      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow p-8 h-[420px]">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Skill Level Distribution
        </h2>

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              label
            />

            <Tooltip />
            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default Dashboard;