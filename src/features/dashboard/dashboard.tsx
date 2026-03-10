import { useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import SkillMatrixFilter from "./components/SkillMatrixFilter";
import skillMatrix from "@/mocks/skillMatrix";

const Dashboard = () => {
  const allUserIds = skillMatrix.users.map((u) => u.id);
  const allTopicIds = skillMatrix.topics.map((t) => t.id);

  const [selectedUsers, setSelectedUsers] = useState<string[]>(allUserIds);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(allTopicIds);

  /**
   * USER FILTER HANDLER
   */
  const handleUsersChange = (values: string[]) => {
    if (values.length === 0) {
      setSelectedUsers([]);
      return;
    }

    setSelectedUsers(values);
  };

  /**
   * TOPIC FILTER HANDLER
   */
  const handleTopicsChange = (values: string[]) => {
    if (values.length === 0) {
      setSelectedTopics([]);
      return;
    }
    setSelectedTopics(values);
  };

  /**
   * EFFECTIVE FILTER VALUES
   * remove "All" before filtering
   */

  const filteredData = useMemo(() => {
    const users = skillMatrix.users.filter(
      (u) => selectedUsers.length === 0 || selectedUsers.includes(u.id),
    );

    const topics = skillMatrix.topics.filter(
      (t) => selectedTopics.length === 0 || selectedTopics.includes(t.id),
    );

    const skills = skillMatrix.skills.filter((skill) => {
      const userMatch =
        selectedUsers.length === 0 || selectedUsers.includes(skill.userId);

      const topicMatch =
        selectedTopics.length === 0 || selectedTopics.includes(skill.topicId);

      return userMatch && topicMatch;
    });

    return {
      users,
      topics,
      skills,
    };
  }, [selectedUsers, selectedTopics]);

  return (
    <div className="p-6 space-y-6">
      <SkillMatrixFilter
        users={skillMatrix.users}
        topics={skillMatrix.topics}
        selectedUsers={selectedUsers}
        selectedTopics={selectedTopics}
        onUsersChange={handleUsersChange}
        onTopicsChange={handleTopicsChange}
      />

      <SkillMatrixTable data={filteredData} />
    </div>
  );
};

export default Dashboard;
