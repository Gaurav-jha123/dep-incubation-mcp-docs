import { useState } from "react";
import skillMatrix from "./../../mocks/skillMatrix";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [selectedUser, setSelectedUser] = useState("");

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };

  // Task-2 → Filter user skills
  const filteredSkills = skillMatrix.skills.filter(
    (skill) => skill.userId === selectedUser
  );

  // Task-3 → Map topicId → topic label
  const mappedSkills = filteredSkills.map((skill) => {
    const topic = skillMatrix.topics.find((t) => t.id === skill.topicId);

    return {
      topic: topic?.label || skill.topicId,
      value: skill.value,
    };
  });

  // Task-4 → Prepare chart data
  const chartData = mappedSkills.map((item) => ({
    name: item.topic,
    score: item.value,
  }));

  return (
    <div className="w-full justify-center p-6">
      <div className="w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Reports Dashboard
        </h1>

        {/* User Selection */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-semibold text-gray-600">
            Select User
          </label>

          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select User --</option>

            {skillMatrix.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <>
            {/* Skill Table */}
            <div className="mt-6 p-6 bg-indigo-50 border border-indigo-200 rounded-xl">
              <h2 className="text-lg font-semibold mb-4 text-indigo-700">
                User Skills
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {mappedSkills.map((skill) => (
                  <div
                    key={skill.topic}
                    className="flex justify-between bg-white p-3 rounded-lg shadow"
                  >
                    <span>{skill.topic}</span>
                    <span className="font-bold">{skill.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task-5 Chart */}
            <div className="mt-8 p-6 bg-white border rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Skill Chart
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}