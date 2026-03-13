import { Card } from "@/components/Card/Card";
import { CHART_COLORS } from "@/lib/chart-colors";
import { scoreTextClass } from "@/lib/score-styles";
import type { User } from "@/types/user";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import SkillBar from "./SkillBar";

type UserSkill = {
  subject: string;
  A: number;
  fullMark: number | 100;
};

type MemberProfileViewProps = {
  userSkills: UserSkill[];
  user?: User | null;
};

export default function MemberProfileView({userSkills, user}: MemberProfileViewProps) {
  const sorted = [...userSkills].sort((a, b) => b.A - a.A);
  const avg = Math.round(userSkills.reduce((s, x) => s + x.A, 0) / userSkills.length);
  const strong = sorted.slice(0, 3);
  const weak = sorted.slice(-3).reverse();

  return (
    <div className="flex flex-col gap-5">

      <div className="flex gap-5 flex-wrap">
        {/* Radar chart */}
        <Card variant="simple" className="flex-1 min-w-[280px]">
          <p className="text-base font-bold text-gray-600 mb-0.5">{user?.name}</p>
          <p className="text-xs text-gray-500 mb-4">
            Average score:{" "}
            <span className={`font-bold ${scoreTextClass(avg)}`}>{avg}</span>
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={userSkills}>
              <PolarGrid stroke={CHART_COLORS.grid} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: CHART_COLORS.axisText, fontSize: 9 }} />
              <Radar dataKey="A" stroke={CHART_COLORS.strong} fill={CHART_COLORS.strong} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Strengths, focus areas, all skills */}
        <div className="flex-1 min-w-[240px] flex flex-col gap-4">
          <Card variant="simple">
            <p className="text-xs text-emerald-400 font-bold tracking-widest mb-3">▲ TOP STRENGTHS</p>
            {strong.map((s) => (
              <SkillBar key={s.subject} label={s.subject} value={s.A} trackWidth="w-20" />
            ))}
          </Card>

          <Card variant="simple">
            <p className="text-xs text-red-400 font-bold tracking-widest mb-3">▼ FOCUS AREAS</p>
            {weak.map((s) => (
              <SkillBar key={s.subject} label={s.subject} value={s.A} trackWidth="w-20" />
            ))}
          </Card>

          <Card variant="header" title="All Skills" className="max-h-56 overflow-y-auto">
            {sorted.map((s) => (
              <SkillBar key={s.subject} label={s.subject} value={s.A} trackWidth="w-16" fontSize="text-[11px]" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}