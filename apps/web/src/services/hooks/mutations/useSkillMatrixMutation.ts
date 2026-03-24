import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkillMatrixEntry,
  updateSkillMatrixEntry,
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
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation };
};
