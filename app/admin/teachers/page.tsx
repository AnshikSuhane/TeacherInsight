"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { getTeachers } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, HelpCircle, FileText, ArrowRight } from "lucide-react"

export default function TeachersListPage() {
  const teachers = getTeachers()

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all teachers. Click on a teacher for detailed analysis.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t) => {
            const initials = t.teacher_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()

            return (
              <Link
                key={t.teacher_id}
                href={`/admin/teachers/${t.teacher_id}`}
                className="group rounded-xl border border-border bg-card p-5 text-card-foreground transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-11 w-11 bg-secondary text-secondary-foreground">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.teacher_name}</p>
                    <p className="text-xs text-muted-foreground">{t.teacher_id}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {t.subjects.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-savra-green" />
                    {t.lessons}
                  </span>
                  <span className="flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5 text-savra-amber" />
                    {t.quizzes}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-savra-purple" />
                    {t.assessments}
                  </span>
                  <span className="ml-auto text-xs text-foreground font-medium">
                    {t.totalActivities} total
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
