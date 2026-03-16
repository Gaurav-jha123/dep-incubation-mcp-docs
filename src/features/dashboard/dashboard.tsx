import skillMatrix from "@/mocks/skillMatrix";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
    <div className="p-6 space-y-8 w-full max-w-[1920px] mx-auto xl:px-16 2xl:px-32 3xl:max-w-[3000px] 3xl:px-64">
      {/* KPI cards */}
      <div
        className="grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          3xl:grid-cols-5
          w-full"
      >
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
      <div className="bg-white rounded-lg shadow p-4 sm:p-8 flex flex-col w-full mx-auto max-w-full">
        <div className="w-full flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center w-full">
            Skill Level Distribution
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8">
          <div className="flex items-center justify-center w-full">
            <ResponsiveContainer
              width={"100%"}
              height={360}
              minWidth={240}
              minHeight={240}
            >
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
      </div>
    </div>
  );
};

export default Dashboard;
