import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type ChartData = {
  name: string;
  score: number;
};

type TopSkillsChartProps = {
  data: ChartData[];
};

export default function TopSkillsChart({ data }: TopSkillsChartProps) {
  return (
    <div className="p-4 bg-white shadow rounded">

      <h3 className="font-semibold mb-4">Top Skills</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}