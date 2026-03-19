import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

type ChartData = {
  name: string;
  score: number;
};

type SkillsRadarChartProps = {
  data: ChartData[];
};

export default function SkillsRadarChart({ data }: SkillsRadarChartProps) {
  return (
    <div 
      className="p-4 bg-card shadow rounded"
      role="figure"
      aria-label="Skill Radar Chart"
    >

      <h3 className="font-semibold mb-4">Skill Radar</h3>

      <ResponsiveContainer width="100%" height={300} aria-hidden="true">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar
            dataKey="score"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>

      <table className="sr-only">
        <caption>Skill Radar Chart Data</caption>
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