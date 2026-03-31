import { useAuthStore } from "@/store/use-auth-store/use-auth-store";
import MultiSelectSearch from "./MultiSelectSearch";

interface Props {
  users: { id: string; name: string }[];
  topics: { id: string; label: string }[];

  selectedUsers: string[];
  selectedTopics: string[];

  onUsersChange: (value: string[]) => void;
  onTopicsChange: (value: string[]) => void;
  onUserCreate: (label: string) => void;
  onTopicCreate: (label: string) => void;

  scoreFilters: string[];
  onScoreFilterChange: (value: string[]) => void;
}

const SkillMatrixFilter = ({
  users,
  topics,
  selectedUsers,
  selectedTopics,
  onUsersChange,
  onTopicsChange,
  onUserCreate,
  onTopicCreate,
}: Props) => {
  const {
    user,
  } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <MultiSelectSearch
        label="Users"
        options={users.map((u) => ({
          value: u.id,
          label: u.name,
        }))}
        selected={selectedUsers}
        onChange={onUsersChange}
        enableAdd={!!isAdmin}
        onCreateOption={onUserCreate}
      />

      <MultiSelectSearch
        label="Topics"
        options={topics.map((t) => ({
          value: t.id,
          label: t.label,
        }))}
        selected={selectedTopics}
        onChange={onTopicsChange}
        enableAdd={!!isAdmin}
        onCreateOption={onTopicCreate}
      />
    </div>
  );
};

export default SkillMatrixFilter;
