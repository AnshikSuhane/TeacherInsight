"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { DailyActivity } from "@/lib/data"
import { format, parseISO } from "date-fns"

interface WeeklyActivityChartProps {
  data: DailyActivity[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "MMM dd"),
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Weekly Activity</h3>
        <p className="text-sm text-muted-foreground">Content creation trends</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradientLessons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.18 155)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.18 155)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientQuizzes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.72 0.15 55)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.72 0.15 55)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientAssessments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.15 300)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.55 0.15 300)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(1 0 0)",
                borderColor: "oklch(0.90 0.02 300)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="lessons"
              name="Lessons"
              stroke="oklch(0.65 0.18 155)"
              fill="url(#gradientLessons)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="quizzes"
              name="Quizzes"
              stroke="oklch(0.72 0.15 55)"
              fill="url(#gradientQuizzes)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="assessments"
              name="Assessments"
              stroke="oklch(0.55 0.15 300)"
              fill="url(#gradientAssessments)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
