import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/services/api/users.api";

export const useUserMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (username: string) => createUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["skill-matrix"] });
    },
  });

  return { createMutation };
};
