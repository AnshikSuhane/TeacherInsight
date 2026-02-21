import { Brain, TrendingUp, AlertTriangle, Users } from "lucide-react"

interface TeacherSummary {
  teacher_name: string
  grades: number[]
  subjects: string[]
  totalActivities: number
}

interface AIPulseSummaryProps {
  mostActive?: TeacherSummary | null
  leastActive?: TeacherSummary | null
  topSubject?: { subject: string; count: number } | null
  activeTeachers: number
}

export function AIPulseSummary({
  mostActive,
  leastActive,
  topSubject,
  activeTeachers,
}: AIPulseSummaryProps) {
  const insights = []

  if (mostActive) {
    insights.push({
      icon: TrendingUp,
      color: "text-savra-green",
      bg: "bg-savra-green/10",
      text: `${mostActive.teacher_name} has the highest workload with ${mostActive.grades.length} classes and ${mostActive.subjects.length} subject${mostActive.subjects.length > 1 ? "s" : ""}.`,
    })
  }

  insights.push({
    icon: Users,
    color: "text-savra-purple",
    bg: "bg-savra-purple-light",
    text: `${activeTeachers} active teachers contributing content this period.`,
  })

  if (leastActive) {
    insights.push({
      icon: AlertTriangle,
      color: "text-savra-amber",
      bg: "bg-savra-amber/10",
      text: `${leastActive.teacher_name} has the fewest activities (${leastActive.totalActivities}) - consider reviewing engagement.`,
    })
  }

  if (topSubject) {
    insights.push({
      icon: Brain,
      color: "text-savra-purple",
      bg: "bg-savra-purple-light",
      text: `${topSubject.subject} is the most active subject with ${topSubject.count} activities.`,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            AI Pulse Summary
          </h3>
          <p className="text-sm text-muted-foreground">
            Real time insights from your data
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${insight.bg}`}
            >
              <insight.icon
                className={`h-4 w-4 ${insight.color}`}
              />
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}