import { createSubTopic } from "@/services/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useSubTopicMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: {topicId: number, subTopics: string[]}) => createSubTopic(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["sub-topics"] });
      return response
    },
  });

  return { createMutation };
};