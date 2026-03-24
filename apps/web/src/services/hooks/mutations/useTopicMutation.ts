import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTopic } from "@/services/api/topics.api";

export const useTopicMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (label: string) => createTopic(label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["skill-matrix"] });
    },
  });

  return { createMutation };
};
