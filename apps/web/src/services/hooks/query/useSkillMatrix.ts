import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchAllSkillMatrix, type ISkillMatrixEntry } from "@/services/api/skill-matrix.api";
import { fetchAllUsers, type IUserResponse } from "@/services/api/users.api";
import { fetchAllTopics, type ITopicResponse } from "@/services/api/topics.api";
import type { SkillMatrixData } from "@/features/skillMatrix/components/types";

/**
 * Transforms API responses into the SkillMatrixData shape
 * that the existing components expect: { topics[], users[], skills[] }.
 * Uses the full users/topics lists so newly created ones appear
 * even before they have any skill-matrix entries.
 */
function transformToSkillMatrixData(
  entries: ISkillMatrixEntry[],
  allUsers: IUserResponse[],
  allTopics: ITopicResponse[],
): SkillMatrixData {
  const users = allUsers.map((u) => ({ id: String(u.id), name: u.name }));
  const topics = allTopics.map((t) => ({ id: String(t.id), label: t.label }));
  const skills = entries.map((e) => ({
    userId: String(e.userId),
    topicId: String(e.topicId),
    value: e.value,
  }));

  return { users, topics, skills };
}

/**
 * Builds a lookup map from "userId-topicId" → entry DB id
 * so we can call PATCH /skill-matrix/:id when updating a cell.
 */
function buildEntryIdMap(entries: ISkillMatrixEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of entries) {
    map.set(`${entry.userId}-${entry.topicId}`, entry.id);
  }
  return map;
}

export const useSkillMatrix = () => {
  const entriesQuery = useQuery({
    queryKey: ["skill-matrix"],
    queryFn: fetchAllSkillMatrix,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: fetchAllTopics,
  });

  const isLoading = entriesQuery.isLoading || usersQuery.isLoading || topicsQuery.isLoading;
  const isError = entriesQuery.isError || usersQuery.isError || topicsQuery.isError;

  const skillMatrixData = useMemo<SkillMatrixData>(() => {
    if (!entriesQuery.data || !usersQuery.data || !topicsQuery.data) {
      return { topics: [], users: [], skills: [] };
    }
    return transformToSkillMatrixData(entriesQuery.data, usersQuery.data, topicsQuery.data);
  }, [entriesQuery.data, usersQuery.data, topicsQuery.data]);

  const entryIdMap = useMemo(() => {
    if (!entriesQuery.data) return new Map<string, number>();
    return buildEntryIdMap(entriesQuery.data);
  }, [entriesQuery.data]);

  return { skillMatrixData, entryIdMap, isLoading, isError };
};
