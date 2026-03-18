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
  scoreFilters,
  onScoreFilterChange,

}: Props) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Score</p>

        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Above 80", value: "above80" },
            { label: "Above 50", value: "above50" },
            { label: "Below 50", value: "below50" },
          ].map((filter) => {
            const active = scoreFilters.includes(filter.value);

            return (
              <button
                key={filter.value}
                onClick={() => {
                  if (active) {
                    onScoreFilterChange(
                      scoreFilters.filter((f) => f !== filter.value)
                    );
                  } else {
                    onScoreFilterChange([...scoreFilters, filter.value]);
                  }
                }}
                className={`px-3 py-1 text-sm rounded-full border ${active
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                  }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <MultiSelectSearch
        label="Users"
        options={users.map((u) => ({
          value: u.id,
          label: u.name,
        }))}
        selected={selectedUsers}
        onChange={onUsersChange}
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
        onCreateOption={onTopicCreate}
      />
    </div>
  );
};

export default SkillMatrixFilter;
