import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ITopicResponse } from "@/services/api";
import TopicChip from "./TopicChip";
import { Button } from "@/components/atoms";

interface AddTopicModalProps {
  isOpen: boolean;
  topic: ITopicResponse | null;
  onClose: () => void;
  onSave: (subTopics: string[]) => void;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  topic,
  onClose,
  onSave,
}) => {
  const [input, setInput] = useState("");
  const [subTopics, setSubTopics] = useState<string[]>([]);

  const handleAddSubTopic = () => {
    if (input.trim() === "") return;
    setSubTopics((prev) => [...prev, input.trim()]);
    setInput("");
  };

  const handleAddSave = () => {
    if(subTopics.length === 0) {
      console.log("Please add at least one subtopic.", "error");
      return;
    }else {
        onSave(subTopics);
    }
    
  };

  const handleClose = () => {
    setSubTopics([]);
    onClose();
  };

  const handleChipRemove = (index: number) => {
    setSubTopics((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="Enter topic name"
              value={topic?.label ?? ""}
              disabled={true}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subtopic">Subtopic</Label>
            <Input
              id="subtopic"
              placeholder="Enter subtopic name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              //   disabled={isLoading}
            />
            <Button variant="outline" size="sm" onClick={handleAddSubTopic}>
              Add
            </Button>
          </div>
          <div className="grid gap-2">
            <div
              id="selected-subtopics"
              className="flex flex-col gap-2 max-h-40 overflow-y-auto"
            >
              {subTopics.length ? (
                subTopics.map((subTopic, index) => (
                  <div key={`${subTopic}-${index}`} className="flex items-center gap-2">
                    <TopicChip topicName={subTopic} onClose={() => {handleChipRemove(index)}} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No subtopics added yet.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={handleAddSave} disabled={subTopics.length === 0}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
