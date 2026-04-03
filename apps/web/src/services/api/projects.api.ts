// src/services/api/projects.api.ts
import { apiClient } from "./client";

export interface IProjectEntry {
  "name": string,
  "description": string,
  "type": string,
  "status": string,
  "clientName": string,
  "startDate": string,
  "endDate": string,
  "skillIds": number[]
}

export interface IProjectfetchEntry {
    "id": number,
  "name": string,
  "description": string,
  "type": string,
  "status": string,
  "clientName": string,
  "startDate": string,
  "endDate": string,
  "skillIds": number[]
}


export interface IProjectPaginatedResponse {
  data: IProjectfetchEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchAllProjects = () =>
  apiClient<IProjectEntry[]>({
    endpoint: "/projects",
    method: "GET",
  });

export const createProjectEntry = (data:IProjectEntry) =>
  apiClient<IProjectEntry>({
    endpoint: "/projects",
    method: "POST",
    body: data,
  });

export const updateProjectEntry = (id: number, data: { value: number }) =>
  apiClient<IProjectEntry>({
    endpoint: `/projects/${id}`,
    method: "PATCH",
    body: data,
  });
