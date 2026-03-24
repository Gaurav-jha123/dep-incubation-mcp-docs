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
    skills.length > 0
      ? skills.reduce((sum, s) => sum + s.value, 0) / skills.length
      : 0;

  const strongest = skills.length > 0 ? skills[0] : undefined;
  const weakest = skills.length > 0 ? skills[skills.length - 1] : undefined;

  return (
    <div
      className="grid md:grid-cols-4 gap-4"
      role="region"
      aria-label="User skills summary statistics"
    >
      <div className="p-4 bg-card shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>User</h4>
          <p className="font-bold text-foreground">{user?.name ?? "-"}</p>
        </div>
      </div>
      <div className="p-4 bg-card shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>Average Skill</h4>
          <p className="font-bold text-foreground">{avg.toFixed(1)}</p>
        </div>
      </div>
      <div className="p-4 bg-card shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>Strongest</h4>
          <p className="font-bold">
            {strongest ? `${strongest.topic} (${strongest.value})` : "-"}
          </p>
        </div>
      </div>
      <div className="p-4 bg-card shadow rounded">
        <div className="flex flex-col gap-2">
          <h4>Weakest</h4>
          <p className="font-bold">
            {weakest ? `${weakest.topic} (${weakest.value})` : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
