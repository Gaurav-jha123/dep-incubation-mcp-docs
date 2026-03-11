import { useEffect, useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import SkillMatrixFilter from "./components/SkillMatrixFilter";
import skillMatrix from "@/mocks/skillMatrix";
import type { Topic } from "./components/types";
import SkillMatrixColumnRearrange from "./components/SkillMatrixColumnRearrange";

const Dashboard = () => {
  const allUserIds = skillMatrix.users.map((u) => u.id);
  const allTopicIds = skillMatrix.topics.map((t) => t.id);

  const [selectedUsers, setSelectedUsers] = useState<string[]>(allUserIds);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(allTopicIds);
  const [orderedTopics, setOrderedTopics] = useState<Topic[]>([]);

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

  useEffect(() => {
    setOrderedTopics(filteredData.topics);
  }, [filteredData.topics]);

  const handleColumnOrderChange = (orderedTopicIds: string[]) => {
    const topicById = new Map(
      filteredData.topics.map((topic) => [topic.id, topic]),
    );
    const nextTopics = orderedTopicIds
      .map((topicId) => topicById.get(topicId))
      .filter((topic): topic is Topic => Boolean(topic));

    setOrderedTopics(nextTopics);
  };

  const orderedFilteredData = useMemo(
    () => ({
      ...filteredData,
      topics: orderedTopics,
    }),
    [filteredData, orderedTopics],
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end items-center">
        <SkillMatrixFilter
          users={skillMatrix.users}
          topics={skillMatrix.topics}
          selectedUsers={selectedUsers}
          selectedTopics={selectedTopics}
          onUsersChange={handleUsersChange}
          onTopicsChange={handleTopicsChange}
        />
        <SkillMatrixColumnRearrange
          topics={orderedTopics}
          onOrderChange={handleColumnOrderChange}
        />
      </div>

      <SkillMatrixTable data={orderedFilteredData} />
    </div>
  );
};

export default Dashboard;
