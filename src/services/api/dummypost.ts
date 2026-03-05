import { apiClient } from "./client";

export const fetchUsersPost = () => {
  return apiClient({ endpoint: "/products", method: "POST", body: { name: "Test Product", price: 10.99 } });
};