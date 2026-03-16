import { useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import skillMatrix from "@/mocks/skillMatrix";
import type { Topic, User } from "./components/types";
import SkillMatrixDrawer from "./components/SkillMatrixDrawer";
import HeatmapLegend from "./components/SkillMatrixTableLegend";
import useLocalStorage from "@/lib/hooks/use-local-storage/use-local-storage";
import createUniqueId from "./utils/create-unique-id";

const ADDED_USERS_STORAGE_KEY = "skill-matrix-added-users";
const ADDED_TOPICS_STORAGE_KEY = "skill-matrix-added-topics";

const SkillMatrix = () => {
  const [addedUsers, setAddedUsers] = useLocalStorage<User[]>(
    ADDED_USERS_STORAGE_KEY,
    [],
  );
  const [addedTopics, setAddedTopics] = useLocalStorage<Topic[]>(
    ADDED_TOPICS_STORAGE_KEY,
    [],
  );

  const users = useMemo(() => [...skillMatrix.users, ...addedUsers], [addedUsers]);
  const topics = useMemo(() => [...skillMatrix.topics, ...addedTopics], [addedTopics]);

  const allUserIds = users.map((u) => u.id);
  const allTopicIds = topics.map((t) => t.id);

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
    const filteredUsers = users.filter(
      (u) => selectedUsers.length === 0 || selectedUsers.includes(u.id),
    );

    const filteredTopics = topics.filter(
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
          if(filter === "above80") return skill.value >= 80;
          if(filter === "above50") return skill.value >= 50;
          if(filter === "below50") return skill.value < 50;
          return true;
        });

      return userMatch && topicMatch && scoreMatch;
    });

    return {
      users: filteredUsers,
      topics: filteredTopics,
      skills,
    };
  }, [scoreFilters, selectedTopics, selectedUsers, topics, users]);

  // Store custom topic order as IDs only
  const [topicOrder, setTopicOrder] = useState<string[]>(() => allTopicIds);

  const handleUserCreate = (name: string) => {
    const normalizedName = name.trim().toLowerCase();
    const alreadyExists = users.some(
      (user) => user.name.trim().toLowerCase() === normalizedName,
    );

    if (alreadyExists) {
      return;
    }

    const nextUser: User = {
      id: createUniqueId(name, users.map((user) => user.id)),
      name: name.trim(),
    };

    setAddedUsers((currentUsers) => [...currentUsers, nextUser]);
    setSelectedUsers((currentUsers) => [...new Set([...currentUsers, nextUser.id])]);
  };

  const handleTopicCreate = (label: string) => {
    const normalizedLabel = label.trim().toLowerCase();
    const alreadyExists = topics.some(
      (topic) => topic.label.trim().toLowerCase() === normalizedLabel,
    );

    if (alreadyExists) {
      return;
    }

    const nextTopic: Topic = {
      id: createUniqueId(label, topics.map((topic) => topic.id)),
      label: label.trim(),
    };

    setAddedTopics((currentTopics) => [...currentTopics, nextTopic]);
    setSelectedTopics((currentTopics) => [...new Set([...currentTopics, nextTopic.id])]);
  };

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
            users={users}
            topics={topics}
            selectedUsers={selectedUsers}
            selectedTopics={selectedTopics}
            onUsersChange={handleUsersChange}
            onTopicsChange={handleTopicsChange}
            onUserCreate={handleUserCreate}
            onTopicCreate={handleTopicCreate}
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
