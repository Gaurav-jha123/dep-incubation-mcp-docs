import { useQuery } from "@tanstack/react-query";
import { fetchAllSkillMatrix, type ISkillMatrixEntry } from "@/services/api/skill-matrix.api";
import type { SkillMatrixData } from "@/features/skillMatrix/components/types";

/**
 * Transforms the flat API response into the SkillMatrixData shape
 * that the existing components expect: { topics[], users[], skills[] }
 */
function transformToSkillMatrixData(entries: ISkillMatrixEntry[]): SkillMatrixData {
  const usersMap = new Map<number, { id: string; name: string }>();
  const topicsMap = new Map<number, { id: string; label: string }>();
  const skills: { userId: string; topicId: string; value: number }[] = [];

  for (const entry of entries) {
    if (!usersMap.has(entry.user.id)) {
      usersMap.set(entry.user.id, { id: String(entry.user.id), name: entry.user.name });
    }
    if (!topicsMap.has(entry.topic.id)) {
      topicsMap.set(entry.topic.id, { id: String(entry.topic.id), label: entry.topic.label });
    }
    skills.push({
      userId: String(entry.userId),
      topicId: String(entry.topicId),
      value: entry.value,
    });
  }

  return {
    users: [...usersMap.values()],
    topics: [...topicsMap.values()],
    skills,
  };
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
  const query = useQuery({
    queryKey: ["skill-matrix"],
    queryFn: fetchAllSkillMatrix,
    select: (data) => ({
      skillMatrixData: transformToSkillMatrixData(data),
      entryIdMap: buildEntryIdMap(data),
    }),
  });

  return {
    ...query,
    skillMatrixData: query.data?.skillMatrixData ?? { topics: [], users: [], skills: [] },
    entryIdMap: query.data?.entryIdMap ?? new Map<string, number>(),
  };
};
