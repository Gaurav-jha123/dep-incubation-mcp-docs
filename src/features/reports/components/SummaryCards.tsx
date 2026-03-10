type Skill = {
  topic: string;
  value: number;
};

type User = {
  id: string;
  name: string;
};

type SummaryCardsProps = {
  skills: Skill[];
  user?: User;
};

export default function SummaryCards({ skills, user }: SummaryCardsProps) {
  const avg =
    skills.reduce((sum, s) => sum + s.value, 0) / skills.length;

  const strongest = skills[0];
  const weakest = skills[skills.length - 1];

  return (
    <div className="grid md:grid-cols-4 gap-4">

      <div className="p-4 bg-white shadow rounded">
        <h4>User</h4>
        <p className="font-bold">{user?.name}</p>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <h4>Average Skill</h4>
        <p className="font-bold">{avg.toFixed(1)}</p>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <h4>Strongest</h4>
        <p className="font-bold">
          {strongest.topic} ({strongest.value})
        </p>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <h4>Weakest</h4>
        <p className="font-bold">
          {weakest.topic} ({weakest.value})
        </p>
      </div>

    </div>
  );
}