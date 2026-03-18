import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  score: number;
};

type SkillsBarChartProps = {
  data: ChartData[];
};

export default function SkillsBarChart({ data }: SkillsBarChartProps) {
  return (
    <div className="p-4 bg-white shadow rounded">

      <h3 className="font-semibold mb-4">Skill Distribution</h3>

      <ResponsiveContainer width="100%" height={300} aria-hidden="true">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0}/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>

      <table className="sr-only">
        <caption>Skill Distribution Bar Chart Data</caption>
        <thead>
          <tr>
            <th scope="col">Skill Name</th>
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