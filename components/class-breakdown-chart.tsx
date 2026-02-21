"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ClassBreakdown {
  className: string
  lessons: number
  quizzes: number
  assessments: number
  total?: number
}

interface ClassBreakdownChartProps {
  data: ClassBreakdown[]
}

export function ClassBreakdownChart({
  data = [],
}: ClassBreakdownChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Class-wise Breakdown
        </h3>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
            />

            <XAxis
              dataKey="className"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />

            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(1 0 0)",
                borderColor: "oklch(0.90 0.02 300)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />

            <Legend wrapperStyle={{ fontSize: "12px" }} />

            <Bar
              dataKey="lessons"
              name="Lessons"
              fill="oklch(0.65 0.18 155)"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="quizzes"
              name="Quizzes"
              fill="oklch(0.72 0.15 55)"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="assessments"
              name="Assessments"
              fill="oklch(0.55 0.15 300)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}