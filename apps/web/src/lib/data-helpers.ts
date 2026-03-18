import type skillMatrix from "@/mocks/skillMatrix";

export const getScore = (skillsData: typeof skillMatrix, userId: string, topicId: string) =>
  skillsData.skills.find((s) => s.userId === userId && s.topicId === topicId)?.value ?? 0;