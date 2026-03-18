import type { User } from "@/types/user";

type Skill = {
  topic: string;
  value: number;
};

type SummaryCardsProps = {
  skills: Skill[];
  user?: User | null;
};

export default function SummaryCards({ skills, user }: SummaryCardsProps) {
  const avg =
    skills.reduce((sum, s) => sum + s.value, 0) / skills.length;

  const strongest = skills[0];
  const weakest = skills[skills.length - 1];

  return (
    <div 
      className="grid md:grid-cols-4 gap-4"
      role="region"
      aria-label="User skills summary statistics"
    >

      <div className="p-4 bg-white shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>User</h4>
          <p className="font-bold">{user?.name}</p>
        </div>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>Average Skill</h4>
          <p className="font-bold">{avg.toFixed(1)}</p>
        </div>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>Strongest</h4>
          <p className="font-bold">
            {strongest.topic} ({strongest.value})
          </p>
        </div>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>Weakest</h4>
          <p className="font-bold">
            {weakest.topic} ({weakest.value})
          </p>
        </div>
      </div>

    </div>
  );
}