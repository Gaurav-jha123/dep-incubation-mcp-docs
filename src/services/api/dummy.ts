import { apiClient } from "./client";

export const fetchUsers = () => {
  return apiClient("/products");
};