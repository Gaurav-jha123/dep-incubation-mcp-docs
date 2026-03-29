import { Table } from "@/components/organisms";

type Skill = {
  topic: string;
  value: number;
};

type SkillsTableProps = {
  skills: Skill[];
};

export default function SkillsTable({ skills }: SkillsTableProps) {
  return (
    <div className="bg-card shadow rounded p-4">
      <h3 className="font-semibold mb-4 text-foreground">All Skills</h3>

      <Table
        caption="Comprehensive List of All Skills and Scores"
        headers={["Skill", "Score"]}
        keys={["topic", "value"]}
        data={skills}
        showSearch={false}
        rowsPerPageOptions={[Math.max(skills.length, 1)]}
      />
    </div>
  );
}
