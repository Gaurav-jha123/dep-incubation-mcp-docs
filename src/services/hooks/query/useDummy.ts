import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../api/dummy";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};