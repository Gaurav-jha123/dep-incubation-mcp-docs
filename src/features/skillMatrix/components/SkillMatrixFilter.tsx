import MultiSelectSearch from "./MultiSelectSearch";

interface Props {
  users: { id: string; name: string }[];
  topics: { id: string; label: string }[];

  selectedUsers: string[];
  selectedTopics: string[];

  onUsersChange: (value: string[]) => void;
  onTopicsChange: (value: string[]) => void;
}

const SkillMatrixFilter = ({
  users,
  topics,
  selectedUsers,
  selectedTopics,
  onUsersChange,
  onTopicsChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <MultiSelectSearch
        label="Users"
        options={users.map((u) => ({
          value: u.id,
          label: u.name,
        }))}
        selected={selectedUsers}
        onChange={onUsersChange}
      />

      <MultiSelectSearch
        label="Topics"
        options={topics.map((t) => ({
          value: t.id,
          label: t.label,
        }))}
        selected={selectedTopics}
        onChange={onTopicsChange}
      />
    </div>
  );
};

export default SkillMatrixFilter;
