import skillMatrix from "@/mocks/skillMatrix";

const KPICards = () => {
  /* totals */
  const totalUsers = skillMatrix.users.length;
  const totalTopics = skillMatrix.topics.length;
  const totalSkills = skillMatrix.skills.length;
  const avgSkillsPerUser = (totalSkills / totalUsers).toFixed(1);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">TEAM</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{totalUsers}</h3>
        <p className="text-gray-500 text-sm">Total Users</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">TOPICS</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{totalTopics}</h3>
        <p className="text-gray-500 text-sm">Topics</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">SKILLS</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{totalSkills}</h3>
        <p className="text-gray-500 text-sm">Total Skills</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">AVERAGE</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{avgSkillsPerUser}</h3>
        <p className="text-gray-500 text-sm">Skills per User</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-rose-100 rounded-lg">
            <span className="text-2xl">🎓</span>
          </div>
          <div className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">COVERAGE</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{totalTopics}</h3>
        <p className="text-gray-500 text-sm">Topics Covered</p>
      </div>
    </div>
  );
};

export default KPICards;