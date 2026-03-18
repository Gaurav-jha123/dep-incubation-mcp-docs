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
    <div className="p-4 bg-white shadow rounded">

      <h3 className="font-semibold mb-4">Skill Radar</h3>

      <ResponsiveContainer width="100%" height={300}>
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

    </div>
  );
}