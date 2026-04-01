
import { fetchAllTopics, type ITopicResponse } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useTopics = () => {
  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: fetchAllTopics,
  });

  const isLoading = topicsQuery.isLoading;
  const isError = topicsQuery.isError;
  const topics: ITopicResponse[] = topicsQuery.data || [];

   return { topics, isLoading, isError };
};
