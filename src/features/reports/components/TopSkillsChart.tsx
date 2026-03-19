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
    <div 
      className="p-4 bg-card border rounded-xl p-6 shadow-sm"
      role="figure"
      aria-label="Top Skills Bar Chart"
    >

      <h3 className="text-foreground font-semibold mb-4">Top Skills</h3>

      <ResponsiveContainer width="100%" height={250} aria-hidden="true">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>

      <table className="sr-only">
        <caption>Top Skills Chart Data</caption>
        <thead>
          <tr>
            <th scope="col">Skill</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}