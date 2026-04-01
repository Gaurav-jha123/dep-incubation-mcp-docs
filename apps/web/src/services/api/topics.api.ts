import { apiClient } from "./client";

export interface ISubTopic {
  id: number;
  label: string;
  topicId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITopicResponse {
  id: number;
  label: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  subTopics: ISubTopic[];
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
