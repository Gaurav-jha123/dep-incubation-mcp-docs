import { scoreBarClass, scoreTextClass } from "@/lib/score-styles";

type SkillBarProps = {
  label: string;
  value: number;
  trackWidth?: string;
  barHeight?: string;
  fontSize?: string;
};

export default function SkillBar({
  label,
  value,
  trackWidth = "w-20",
  barHeight = "h-1.5",
  fontSize = "text-xs",
}: SkillBarProps) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className={`flex-1 ${fontSize} text-muted-foreground`}>{label}</span>
      <div className={`${trackWidth} ${barHeight} bg-foreground rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full ${scoreBarClass(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`${fontSize} font-bold w-6 text-right ${scoreTextClass(value)}`}>{value}</span>
    </div>
  );
}