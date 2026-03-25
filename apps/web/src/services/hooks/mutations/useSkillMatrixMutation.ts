import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkillMatrixEntry,
  updateSkillMatrixEntry,
  type ISkillMatrixEntry,
} from "@/services/api/skill-matrix.api";

export const useSkillMatrixMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["skill-matrix"] });

  const createMutation = useMutation({
    mutationFn: createSkillMatrixEntry,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { value: number } }) =>
      updateSkillMatrixEntry(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["skill-matrix"] });
      const previous = queryClient.getQueryData<ISkillMatrixEntry[]>(["skill-matrix"]);
      queryClient.setQueryData<ISkillMatrixEntry[]>(["skill-matrix"], (old) =>
        old?.map((entry) => (entry.id === id ? { ...entry, value: data.value } : entry)) ??
        [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) queryClient.setQueryData(["skill-matrix"], context.previous);
    },
  });

  return { createMutation, updateMutation };
};
