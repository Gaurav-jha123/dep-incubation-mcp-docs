import React, { useState, useMemo } from "react";
import { useSkillMatrix } from "@/services/hooks/query/useSkillMatrix";

import TopSkillsChart from "./components/TopSkillsChart";
import SkillsTable from "./components/SkillsTable";
import UserSelector from "./components/UserSelector";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import MemberProfileView from "./components/MemberProfileView";
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";
import { getScore } from "@/lib/data-helpers";

export default function Reports() {
  const { skillMatrixData: skillMatrix, isLoading, isError } = useSkillMatrix();
  const currentUser = useAuthStore((s) => s.user);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined,
  );

  const memoized = useMemo(() => {
    if (
      !selectedUser ||
      !skillMatrix.users.length ||
      !skillMatrix.topics.length
    ) {
      return {
        sortedSkills: [],
        topSkills: [],
        selectedUserObj: null,
        userSkills: [],
      };
    }

    const topicMap = new Map(skillMatrix.topics.map((t) => [t.id, t.label]));

    const skills = skillMatrix.skills
      .filter((skill) => String(skill.userId) === String(selectedUser))
      .map((skill) => ({
        topic: topicMap.get(skill.topicId) || skill.topicId,
        value: skill.value,
      }));

    const sorted = [...skills].sort((a, b) => b.value - a.value);

    const top = sorted.slice(0, 5).map((item) => ({
      name: item.topic,
      score: item.value,
    }));

    const user = skillMatrix.users.find(
      (u) => String(u.id) === String(selectedUser),
    );

    const userSkillsData = skillMatrix.topics.map((t) => ({
      subject: t.label,
      A: getScore(skillMatrix, String(selectedUser), t.id),
      fullMark: 100,
    }));

    return {
      sortedSkills: sorted,
      topSkills: top,
      selectedUserObj: user,
      userSkills: userSkillsData,
    };
  }, [selectedUser, skillMatrix]);

  // Set default selected user to logged-in user if present, else first user
  React.useEffect(() => {
    if (!selectedUser && skillMatrix.users.length > 0) {
      if (currentUser) {
        const found = skillMatrix.users.find(
          (u) => String(u.id) === String(currentUser.id),
        );
        if (found) {
          setSelectedUser(found.id);
          return;
        }
      }
      setSelectedUser(skillMatrix.users[0].id);
    }
  }, [selectedUser, skillMatrix.users, currentUser]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading reports data.</div>;

  const { sortedSkills, topSkills, selectedUserObj, userSkills } = memoized;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <UserSelector
          users={skillMatrix.users}
          selectedUser={selectedUser ?? ""}
          onChange={setSelectedUser}
        />
        {selectedUser && <ExportButtons skills={sortedSkills} />}
      </div>
      {selectedUser && (
        <div id="report-section" className="space-y-6">
          <SummaryCards skills={sortedSkills} user={selectedUserObj} />
          <MemberProfileView userSkills={userSkills} user={selectedUserObj} />
          <TopSkillsChart data={topSkills} />
          <SkillsTable skills={sortedSkills} />
        </div>
      )}
    </div>
  );
}
