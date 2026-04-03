import { apiClient } from "./client";

export const createSubTopic = (data: {topicId: number, subTopics: string[]}) =>
  apiClient({
    endpoint: "/sub-topics",
    method: "POST",
    body: data,
  });