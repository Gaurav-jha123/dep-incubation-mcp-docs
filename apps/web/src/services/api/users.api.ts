import { apiClient } from "./client";

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface ICreateUserResponse {
  user: IUserResponse;
}

export const fetchAllUsers = () =>
  apiClient<IUserResponse[]>({
    endpoint: "/users",
    method: "GET",
  });

export const createUser = (username: string) =>
  apiClient<ICreateUserResponse>({
    endpoint: "/users",
    method: "POST",
    body: { username },
  });
