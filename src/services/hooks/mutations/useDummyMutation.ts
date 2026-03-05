import { useMutation } from "@tanstack/react-query";
import { fetchUsers } from "../../api/dummy";

export const useUsersMutation = () => {
  return useMutation({
    mutationKey: ["users"],
    mutationFn: fetchUsers,
  });
};