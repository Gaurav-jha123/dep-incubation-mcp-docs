import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type SkillData = {
  name: string
  score: number
}

type Props = {
  data: SkillData[]
}

const SHADES = [
  "#111111",
  "#2b2b2b",
  "#444444",
  "#5e5e5e",
  "#777777",
  "#909090",
  "#a9a9a9",
  "#c2c2c2",
  "#d9d9d9",
  "#eeeeee"
]

export default function SkillsPieChart({ data }: Props) {

  const sorted = [...data].sort((a, b) => b.score - a.score)

  return (
    <div 
      className="p-4 bg-card border rounded-xl shadow-sm"
      role="figure"
      aria-label="Skill Distribution Pie Chart"
    >

      <h2 className="text-lg font-semibold mb-6">
        Skill Distribution
      </h2>

      <div className="grid grid-cols-2 gap-10 items-center">

        {/* Chart */}

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%" aria-hidden="true">

            <PieChart>

              <Pie
                data={sorted}
                dataKey="score"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                stroke="#fff"
                strokeWidth={2}
              >
                {sorted.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SHADES[index % SHADES.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Skill list */}

        <ul className="space-y-3 overflow-y-auto max-h-[350px] pr-2">

          {sorted.map((skill, i) => (

            <li
              key={i}
              className="flex justify-between items-center border-b pb-2 text-sm"
            >
              <div className="flex items-center gap-3">

                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: SHADES[i % SHADES.length]
                  }}
                  aria-hidden="true"
                />

                <span className="text-foreground">
                  {skill.name}
                </span>

              </div>

              <span className="font-semibold text-foreground">
                {skill.score}%
              </span>

            </li>

          ))}

        </ul>

      </div>

    </div>
  )
}