type Skill = {
  topic: string;
  value: number;
};

type SkillsTableProps = {
  skills: Skill[];
};

export default function SkillsTable({ skills }: SkillsTableProps) {
  return (
    <div className="bg-white shadow rounded p-4">

      <h3 className="font-semibold mb-4">All Skills</h3>

      <table className="w-full">

        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Skill</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>

        <tbody>
          {skills.map((s) => (
            <tr key={s.topic} className="border-b">
              <td className="p-2">{s.topic}</td>
              <td className="p-2">{s.value}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}