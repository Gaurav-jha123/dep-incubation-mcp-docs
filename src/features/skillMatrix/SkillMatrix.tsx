import { useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import skillMatrixMock from "@/mocks/skillMatrix";
import type { Topic, User } from "./components/types";
import SkillMatrixDrawer from "./components/SkillMatrixDrawer";
import HeatmapLegend from "./components/SkillMatrixTableLegend";
import useLocalStorage from "@/lib/hooks/use-local-storage/use-local-storage";
import createUniqueId from "./utils/create-unique-id";
import type { QueryFilter } from "./components/SkillMatrixQueryBuilder";
import { applySkillMatrixFilters } from "./utils/skillMatrixFilters";

const ADDED_USERS_STORAGE_KEY = "skill-matrix-added-users";
const ADDED_TOPICS_STORAGE_KEY = "skill-matrix-added-topics";

const SkillMatrix = () => {

  //  matrix stored in state to allow editing
  const [skillMatrix, setSkillMatrix] = useState(skillMatrixMock);

  const [addedUsers, setAddedUsers] = useLocalStorage<User[]>(
    ADDED_USERS_STORAGE_KEY,
    [],
  );
  const [addedTopics, setAddedTopics] = useLocalStorage<Topic[]>(
    ADDED_TOPICS_STORAGE_KEY,
    [],
  );

  const users = useMemo(
  () => [...skillMatrix.users, ...addedUsers],
  [skillMatrix.users, addedUsers],
);
  const topics = useMemo(
  () => [...skillMatrix.topics, ...addedTopics],
  [skillMatrix.topics, addedTopics],
);

  const allUserIds = users.map((u) => u.id);
  const allTopicIds = topics.map((t) => t.id);

  const [selectedUsers, setSelectedUsers] = useState<string[]>(allUserIds);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(allTopicIds);

  const [scoreFilters, setScoreFilters] = useState<string[]>([]);
  const [queryFilters, setQueryFilters] = useState<QueryFilter[]>([]);

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
   * UPDATE SKILL VALUE
   */
  const updateSkill = (userId: string, topicId: string, value: number) => {
    setSkillMatrix((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.userId === userId && skill.topicId === topicId
          ? { ...skill, value }
          : skill
      ),
    }));
  };

  /**
   * EFFECTIVE FILTER VALUES
   * remove "All" before filtering
   */
  const filteredData = useMemo(() => {
    return applySkillMatrixFilters(
      skillMatrix,
      users,
      topics,
      selectedUsers,
      selectedTopics,
      scoreFilters,
      queryFilters
    );
  }, [skillMatrix, scoreFilters, queryFilters, selectedTopics, selectedUsers, topics, users]);

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
            queryFilters={queryFilters}
            onQueryFiltersChange={setQueryFilters}
          />
        </div>
      </div>

      {/* table area */}
      <div className="flex-1 min-h-0">
        <SkillMatrixTable
          data={orderedFilteredData}
          onUpdateSkill={updateSkill}
          currentUserId={"alex"}
        />
      </div>
    </div>
  );
};

export default SkillMatrix;
