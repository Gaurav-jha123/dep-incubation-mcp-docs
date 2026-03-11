import { useEffect, useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import skillMatrix from "@/mocks/skillMatrix";
import type { Topic } from "./components/types";
import SkillMatrixDrawer from "./components/SkillMatrixDrawer";

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

  const [orderedTopics, setOrderedTopics] = useState<Topic[]>(() => filteredData.topics);

  // Sync orderedTopics when filteredData.topics changes (filter applied)
  useEffect(() => {
    const filteredTopicIds = new Set(filteredData.topics.map((t) => t.id));
    
    // Keep existing order for topics still in filter, remove deselected ones
    const syncedTopics = orderedTopics.filter((t) => filteredTopicIds.has(t.id));
    
    // Add any newly selected topics that weren't in orderedTopics
    const existingIds = new Set(syncedTopics.map((t) => t.id));
    const newTopics = filteredData.topics.filter((t) => !existingIds.has(t.id));
    
    const finalTopics = [...syncedTopics, ...newTopics];
    
    // Only update if there's an actual change
    if (finalTopics.length !== orderedTopics.length || 
        finalTopics.some((t, i) => t.id !== orderedTopics[i]?.id)) {
        setOrderedTopics(finalTopics);
    }
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
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-end items-center">
        <SkillMatrixDrawer
          users={skillMatrix.users}
          topics={skillMatrix.topics}
          selectedUsers={selectedUsers}
          selectedTopics={selectedTopics}
          onUsersChange={handleUsersChange}
          onTopicsChange={handleTopicsChange}
          orderedTopics={orderedTopics}
          onColumnOrderChange={handleColumnOrderChange}
        />
      </div>

      {/* table area */}
      <div className="flex-1 min-h-0">
        <SkillMatrixTable data={orderedFilteredData} />
      </div>
    </div>
  );
};

export default Dashboard;
