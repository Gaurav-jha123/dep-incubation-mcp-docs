import { Accordion } from "@/components/organisms";
import "./Topics.scss";
import type { ISubTopic, ITopicResponse } from "@/services/api";
import { useTopics } from "@/services/hooks/query/useTopics";

export default function Topics() {
  const { topics, isLoading, isError } = useTopics();

  const items = topics.map((topic: ITopicResponse) => ({
        title: topic.label,
        content: topic.subTopics.length > 0 ? topic.subTopics.map((sub: ISubTopic) => `• ${sub.label}`).join("\n") : 'No subtopics available.',
      }));
console.log(items)
  return (
    <div className="topics-page">
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading Topics...</p>
        </div>
      )}

      {isError && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Failed to load Topics.</p>
        </div>
      )}

      {!isLoading && !isError && <Accordion items={items} />}
    </div>
  );
}
