"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { activityRecords, getTeachers } from "@/lib/data"
import { useMemo } from "react"
import { BookOpen, HelpCircle, FileText, Users } from "lucide-react"

export default function ClassroomsPage() {
  const classData = useMemo(() => {
    const map = new Map<number, {
      grade: number
      subjects: Set<string>
      teacherIds: Set<string>
      lessons: number
      quizzes: number
      assessments: number
    }>()

    for (const r of activityRecords) {
      let c = map.get(r.grade)
      if (!c) {
        c = { grade: r.grade, subjects: new Set(), teacherIds: new Set(), lessons: 0, quizzes: 0, assessments: 0 }
        map.set(r.grade, c)
      }
      c.subjects.add(r.subject)
      c.teacherIds.add(r.teacher_id)
      if (r.activity_type === "Lesson Plan") c.lessons++
      else if (r.activity_type === "Quiz") c.quizzes++
      else if (r.activity_type === "Question Paper") c.assessments++
    }

    return Array.from(map.values()).sort((a, b) => a.grade - b.grade)
  }, [])

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classrooms</h1>
          <p className="text-sm text-muted-foreground">
            Overview of activity across all classes
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classData.map((c) => (
            <div
              key={c.grade}
              className="rounded-xl border border-border bg-card p-5 text-card-foreground"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Class {c.grade}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {c.teacherIds.size} teachers
                </div>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Subjects: {Array.from(c.subjects).join(", ")}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-savra-green" />
                  {c.lessons} Lessons
                </span>
                <span className="flex items-center gap-1 text-foreground">
                  <HelpCircle className="h-3.5 w-3.5 text-savra-amber" />
                  {c.quizzes} Quizzes
                </span>
                <span className="flex items-center gap-1 text-foreground">
                  <FileText className="h-3.5 w-3.5 text-savra-purple" />
                  {c.assessments} Assessments
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
