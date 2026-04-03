import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion } from "@/components/organisms";
import { Button } from "@/components/atoms";
import { AddTopicModal } from "./components/AddTopicModal";
import { Alert } from "@/components/molecules/Alert/Alert";
import type { ISubTopic, ITopicResponse } from "@/services/api";
import { useTopics } from "@/services/hooks/query/useTopics";
import { useSubTopicMutation } from "@/services/hooks";
import "./Topics.scss";
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";

export default function Topics() {
  const { topics, isLoading, isError } = useTopics();
  const { createMutation } = useSubTopicMutation();
    const {
      user,
    } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<ITopicResponse | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning">(
    "success",
  );
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showAlertNotification = useCallback(
    (message: string, type: "success" | "error" | "warning" = "success") => {
      clearTimeout(hideTimerRef.current);
      setAlertMessage(message);
      setAlertType(type);
      setShowAlert(true);
      hideTimerRef.current = setTimeout(() => setShowAlert(false), 3000);
    },
    [],
  );
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handleSave = (subTopics: string[]) => {
    createMutation.mutate(
      { topicId: currentTopic?.id || 0, subTopics: subTopics },
      {
        onSuccess: (response) => {
          showAlertNotification((response as Record<string, string>).message, "success");
        },
        onError: (error: Error) => showAlertNotification(error.message, "error"),
      },
    );
    setIsModalOpen(false);
    setCurrentTopic(null);
  };

  const onClickAddSubTopic = (topic: ITopicResponse) => {
    setCurrentTopic(topic);
    setIsModalOpen(true);
  };

  const items = topics.map((topic: ITopicResponse) => ({
    title: topic.label,
    content: (
      <div className="sub-topic-container">
        {topic.subTopics.length > 0 ? (
          <ul className="sub-topic">
            {topic.subTopics.map((sub: ISubTopic) => (
              <li key={sub.id}>{sub.label}</li>
            ))}
          </ul>
        ) : (
          <p>No subtopics available.</p>
        )}
        {isAdmin && (
        <Button
          className="add-subtopic-btn"
          size="sm"
          variant={"outline"}
          onClick={() => onClickAddSubTopic(topic)}
        >
          Add Subtopic
        </Button>
        )}
      </div>
    ),
  }));

  return (
    <div className="topics-page">
      {/* Alert Notification */}
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          isOpen={showAlert}
          closable
          onClose={() => setShowAlert(false)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300"
        />
      )}
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

      {isModalOpen && (
        <AddTopicModal
          topic={currentTopic}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(subTopics) => handleSave(subTopics)}
        />
      )}
    </div>
  );
}
