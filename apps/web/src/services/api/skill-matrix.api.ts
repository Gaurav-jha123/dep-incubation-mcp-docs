// src/services/api/skill-matrix.api.ts
import { apiClient } from "./client";

export interface ISkillMatrixEntry {
  id: number;
  userId: number;
  topicId: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string; email: string };
  topic: { id: number; label: string };
}

export interface ISkillMatrixPaginatedResponse {
  data: ISkillMatrixEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchAllSkillMatrix = () =>
  apiClient<ISkillMatrixEntry[]>({
    endpoint: "/skill-matrix",
    method: "GET",
  });

export const createSkillMatrixEntry = (data: { topicId: number; value: number }) =>
  apiClient<ISkillMatrixEntry>({
    endpoint: "/skill-matrix",
    method: "POST",
    body: data,
  });

export const updateSkillMatrixEntry = (id: number, data: { value: number }) =>
  apiClient<ISkillMatrixEntry>({
    endpoint: `/skill-matrix/${id}`,
    method: "PATCH",
    body: data,
  });
