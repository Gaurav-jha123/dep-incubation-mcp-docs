import { useState, useMemo } from "react";
import skillMatrix from "../../mocks/skillMatrix";

import TopSkillsChart from "./components/TopSkillsChart";
import SkillsTable from "./components/SkillsTable";
import UserSelector from "./components/UserSelector";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import MemberProfileView from "./components/MemberProfileView";

import { getScore } from "@/lib/data-helpers";

export default function Reports() {
  const [selectedUser, setSelectedUser] = useState(skillMatrix.users[0]?.id);

  const {
    sortedSkills,
    topSkills,
    selectedUserObj,
    userSkills,
  } = useMemo(() => {
    if (!selectedUser) {
      return {
        sortedSkills: [],
        topSkills: [],
        selectedUserObj: null,
        userSkills: [],
      };
    }

    const topicMap = new Map(
      skillMatrix.topics.map((t) => [t.id, t.label])
    );

    const skills = skillMatrix.skills
      .filter((skill) => skill.userId === selectedUser)
      .map((skill) => ({
        topic: topicMap.get(skill.topicId) || skill.topicId,
        value: skill.value,
      }));

    const sorted = skills.sort((a, b) => b.value - a.value);

    const top = sorted.slice(0, 5).map((item) => ({
      name: item.topic,
      score: item.value,
    }));;

    const user = skillMatrix.users.find(
      (u) => u.id === selectedUser
    );

    const userSkillsData = skillMatrix.topics.map((t) => ({
      subject: t.label,
      A: getScore(skillMatrix, selectedUser, t.id),
      fullMark: 100,
    }));

    return {
      sortedSkills: sorted,
      topSkills: top,
      selectedUserObj: user,
      userSkills: userSkillsData,
    };
  }, [selectedUser]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
        {selectedUser && <ExportButtons skills={sortedSkills} />}
      </div>

      <UserSelector
        users={skillMatrix.users}
        selectedUser={selectedUser}
        onChange={setSelectedUser}
      />

      {selectedUser && (
        <div id="report-section" className="space-y-6">
          <SummaryCards skills={sortedSkills} user={selectedUserObj} />

          <MemberProfileView
            userSkills={userSkills}
            user={selectedUserObj}
          />

          <TopSkillsChart data={topSkills} />

          <SkillsTable skills={sortedSkills} />
        </div>
      )}
    </div>
  );
}