"use client"

import { format, parseISO } from "date-fns"
import {
  BookOpen,
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react"

interface ActivityRecord {
  teacher_id: string
  subject: string
  grade: number
  activity_type: "Lesson Plan" | "Quiz" | "Question Paper"
  created_at: string
}

interface RecentActivityProps {
  activities?: ActivityRecord[]
  limit?: number
}

const activityIcon: Record<string, any> = {
  "Lesson Plan": BookOpen,
  Quiz: HelpCircle,
  "Question Paper": FileText,
}

const activityColor: Record<string, string> = {
  "Lesson Plan": "text-savra-green bg-savra-green/10",
  Quiz: "text-savra-amber bg-savra-amber/10",
  "Question Paper": "text-savra-purple bg-savra-purple-light",
}

export function RecentActivity({
  activities = [],
  limit = 6,
}: RecentActivityProps) {
  const items = activities.slice(0, limit)

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        Recent Activity
      </h3>

      {items.length === 0 ? (
        <div className="flex items-start gap-3 rounded-lg bg-savra-amber/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-savra-amber" />
          <div>
            <p className="text-sm font-medium text-foreground">
              No Recent Activity
            </p>
            <p className="text-xs text-muted-foreground">
              No lessons or quizzes created yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((a, i) => {
            const Icon =
              activityIcon[a.activity_type] || FileText

            const colorClass =
              activityColor[a.activity_type] ||
              "text-primary bg-muted"

            let formattedDate = ""

            try {
              formattedDate = format(
                parseISO(a.created_at),
                "MMM dd, yyyy h:mm a"
              )
            } catch {
              formattedDate = a.created_at
            }

            return (
              <div
                key={`${a.teacher_id}-${a.created_at}-${i}`}
                className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {a.activity_type} - {a.subject}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Class {a.grade} &middot; {formattedDate}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}