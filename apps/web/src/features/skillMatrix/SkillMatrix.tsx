import { useMemo, useState } from "react";
import SkillMatrixTable from "./components/SkillMatrixTable";
import type { Topic } from "./components/types";
import SkillMatrixDrawer from "./components/SkillMatrixDrawer";
import HeatmapLegend from "./components/SkillMatrixTableLegend";
import type { QueryFilter } from "./components/SkillMatrixQueryBuilder";
import { applySkillMatrixFilters } from "./utils/skillMatrixFilters";
import { useSkillMatrix } from "@/services/hooks/query/useSkillMatrix";
import { useSkillMatrixMutation } from "@/services/hooks/mutations/useSkillMatrixMutation";
import { useUserMutation } from "@/services/hooks/mutations/useUserMutation";
import { useTopicMutation } from "@/services/hooks/mutations/useTopicMutation";
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";

const SkillMatrix = () => {

  const { skillMatrixData: skillMatrix, entryIdMap, isLoading, isError } = useSkillMatrix();
  const { updateMutation } = useSkillMatrixMutation();
  const { createMutation: createUserMutation } = useUserMutation();
  const { createMutation: createTopicMutation } = useTopicMutation();
  const currentUser = useAuthStore((s) => s.user);

  const users = skillMatrix.users;
  const topics = skillMatrix.topics;

  const allUserIds = users.map((u) => u.id);
  const allTopicIds = topics.map((t) => t.id);

  const [selectedUsers, setSelectedUsers] = useState<string[]>(allUserIds);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(allTopicIds);

  // Adjust selections during render when data changes (React-recommended pattern)
  const [prevUserCount, setPrevUserCount] = useState(allUserIds.length);
  if (allUserIds.length !== prevUserCount) {
    setPrevUserCount(allUserIds.length);
    setSelectedUsers(allUserIds);
  }

  const [prevTopicCount, setPrevTopicCount] = useState(allTopicIds.length);
  if (allTopicIds.length !== prevTopicCount) {
    setPrevTopicCount(allTopicIds.length);
    setSelectedTopics(allTopicIds);
  }

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
    const entryId = entryIdMap.get(`${userId}-${topicId}`);
    if (entryId) {
      updateMutation.mutate({ id: entryId, data: { value } });
    }
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

    createUserMutation.mutate(name.trim());
  };

  const handleTopicCreate = (label: string) => {
    const normalizedLabel = label.trim().toLowerCase();
    const alreadyExists = topics.some(
      (topic) => topic.label.trim().toLowerCase() === normalizedLabel,
    );

    if (alreadyExists) {
      return;
    }

    createTopicMutation.mutate(label.trim());
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
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading skill matrix…</p>
        </div>
      )}

      {isError && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Failed to load skill matrix data.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
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
              currentUserId={currentUser ? String(currentUser.id) : ""}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SkillMatrix;
