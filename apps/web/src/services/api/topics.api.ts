import { apiClient } from "./client";

export interface ITopicResponse {
  id: number;
  label: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const fetchAllTopics = () =>
  apiClient<ITopicResponse[]>({
    endpoint: "/topics",
    method: "GET",
  });

export const createTopic = (label: string) =>
  apiClient<ITopicResponse>({
    endpoint: "/topics",
    method: "POST",
    body: { label },
  });
