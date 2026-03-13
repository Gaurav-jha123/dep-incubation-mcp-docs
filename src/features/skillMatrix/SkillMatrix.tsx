import { useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import skillMatrix from "@/mocks/skillMatrix";
import type { Topic } from "./components/types";
import SkillMatrixDrawer from "./components/SkillMatrixDrawer";
import HeatmapLegend from "./components/SkillMatrixTableLegend";

const SkillMatrix = () => {
  const allUserIds = skillMatrix.users.map((u) => u.id);
  const allTopicIds = skillMatrix.topics.map((t) => t.id);

  const [selectedUsers, setSelectedUsers] = useState<string[]>(allUserIds);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(allTopicIds);

  const [scoreFilters, setScoreFilters] = useState<string[]>([]);

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

      const scoreMatch =
        scoreFilters.length === 0 ||
        scoreFilters.some((filter) => {
          if (filter === "above80") return skill.value >= 80;
          if (filter === "above50") return skill.value >= 50;
          if (filter === "below50") return skill.value < 50;
          return true;
        });

      return userMatch && topicMatch && scoreMatch;
    });

    return {
      users,
      topics,
      skills,
    };
  }, [selectedUsers, selectedTopics,scoreFilters]);

  // Store custom topic order as IDs only
  const [topicOrder, setTopicOrder] = useState<string[]>(() => allTopicIds);

  // Compute ordered topics based on current filter and custom order
  const orderedTopics = useMemo(() => {
    const topicById = new Map(filteredData.topics.map((t) => [t.id, t]));

    // Keep topics from custom order that are still in filtered set
    const ordered: Topic[] = [];
    for (const id of topicOrder) {
      const topic = topicById.get(id);
      if (topic) {
        ordered.push(topic);
      }
    }

    // Add any newly selected topics not in custom order
    const orderedIds = new Set(ordered.map((t) => t.id));
    for (const topic of filteredData.topics) {
      if (!orderedIds.has(topic.id)) {
        ordered.push(topic);
      }
    }

    return ordered;
  }, [filteredData.topics, topicOrder]);

  const handleColumnOrderChange = (orderedTopicIds: string[]) => {
    setTopicOrder(orderedTopicIds);
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
      <div className="relative flex justify-center items-center">
        <HeatmapLegend />
        <div className="absolute right-0">
          <SkillMatrixDrawer
            users={skillMatrix.users}
            topics={skillMatrix.topics}
            selectedUsers={selectedUsers}
            selectedTopics={selectedTopics}
            onUsersChange={handleUsersChange}
            onTopicsChange={handleTopicsChange}
            orderedTopics={orderedTopics}
            onColumnOrderChange={handleColumnOrderChange}
            scoreFilters={scoreFilters}
            onScoreFilterChange={setScoreFilters}
          />
        </div>
      </div>

      {/* table area */}
      <div className="flex-1 min-h-0">
        <SkillMatrixTable data={orderedFilteredData} />
      </div>
    </div>
  );
};

export default SkillMatrix;
