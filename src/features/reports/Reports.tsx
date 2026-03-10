import { useState, useMemo } from "react";
import skillMatrix from "../../mocks/skillMatrix";

import SkillsBarChart from "./components/SkillsBarChart";
import SkillsRadarChart from "./components/SkillsRadarChart";
import TopSkillsChart from "./components/TopSkillsChart";
import SkillsTable from "./components/SkillsTable";

import UserSelector from "./components/UserSelector";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";

export default function Reports() {
  const [selectedUser, setSelectedUser] = useState("");

  // Filter skills for selected user
  const filteredSkills = useMemo(() => {
    return skillMatrix.skills.filter(
      (skill) => skill.userId === selectedUser
    );
  }, [selectedUser]);

  // Map topic labels
  const mappedSkills = useMemo(() => {
    return filteredSkills.map((skill) => {
      const topic = skillMatrix.topics.find(
        (t) => t.id === skill.topicId
      );

      return {
        topic: topic?.label || skill.topicId,
        value: skill.value,
      };
    });
  }, [filteredSkills]);

  // Sort skills
  const sortedSkills = useMemo(() => {
    return [...mappedSkills].sort((a, b) => b.value - a.value);
  }, [mappedSkills]);

  // Chart data
  const chartData = sortedSkills.map((item) => ({
    name: item.topic,
    score: item.value,
  }));

  // Top skills
  const topSkills = chartData.slice(0, 5);

  const selectedUserObj = skillMatrix.users.find(
    (u) => u.id === selectedUser
  );

  return (
    <div className="p-8 space-y-8">

      <h1 className="text-3xl font-bold text-center">
        Developer Skill Reports
      </h1>

      <UserSelector
        users={skillMatrix.users}
        selectedUser={selectedUser}
        onChange={setSelectedUser}
      />

      {selectedUser && (
        <>
          <ExportButtons skills={sortedSkills} />

          <div id="report-section" className="space-y-6">

            <SummaryCards skills={sortedSkills} user={selectedUserObj} />

            <div className="grid md:grid-cols-2 gap-6">
              <SkillsBarChart data={chartData} />
              <SkillsRadarChart data={chartData} />
            </div>

            <TopSkillsChart data={topSkills} />

            <SkillsTable skills={sortedSkills} />

          </div>
        </>
      )}

    </div>
  );
}