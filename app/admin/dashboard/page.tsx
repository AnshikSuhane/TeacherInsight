"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { WeeklyActivityChart } from "@/components/weekly-activity-chart"
import { AIPulseSummary } from "@/components/ai-pulse-summary"
import { getGlobalInsights, getWeeklyActivity, activityRecords, getTeachers } from "@/lib/data"
import { Users, BookOpen, FileText, HelpCircle, TrendingUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [timePeriod, setTimePeriod] = useState("week")

  const insights = getGlobalInsights()

  // Filter records based on selections
  const filteredRecords = useMemo(() => {
    return activityRecords.filter((r) => {
      if (selectedGrade !== "all" && r.grade !== Number(selectedGrade)) return false
      if (selectedSubject !== "all" && r.subject !== selectedSubject) return false
      if (timePeriod === "week") {
        const weekAgo = new Date("2026-02-11")
        return new Date(r.created_at) >= weekAgo
      }
      return true
    })
  }, [selectedGrade, selectedSubject, timePeriod])

  const filteredLessons = filteredRecords.filter((r) => r.activity_type === "Lesson Plan").length
  const filteredQuizzes = filteredRecords.filter((r) => r.activity_type === "Quiz").length
  const filteredAssessments = filteredRecords.filter((r) => r.activity_type === "Question Paper").length
  const filteredTeacherIds = new Set(filteredRecords.map((r) => r.teacher_id))

  // Weekly chart data (filtered)
  const weeklyData = useMemo(() => {
    const map = new Map<string, { date: string; lessons: number; quizzes: number; assessments: number }>()
    for (const r of filteredRecords) {
      const date = r.created_at.split(" ")[0]
      let d = map.get(date)
      if (!d) {
        d = { date, lessons: 0, quizzes: 0, assessments: 0 }
        map.set(date, d)
      }
      if (r.activity_type === "Lesson Plan") d.lessons++
      else if (r.activity_type === "Quiz") d.quizzes++
      else if (r.activity_type === "Question Paper") d.assessments++
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredRecords])

  const teachers = getTeachers()

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        {/* Header */}
        <DashboardHeader
          title="Admin Companion"
          subtitle="See What's Happening Across your School"
          grades={insights.allGrades}
          subjects={insights.allSubjects}
          selectedGrade={selectedGrade}
          selectedSubject={selectedSubject}
          onGradeChange={setSelectedGrade}
          onSubjectChange={setSelectedSubject}
        />

        {/* Insights section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Insights</h2>
          <Tabs value={timePeriod} onValueChange={setTimePeriod}>
            <TabsList>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="year">This Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            label="Active Teachers"
            value={filteredTeacherIds.size}
            sublabel="This week"
            icon={Users}
          />
          <StatCard
            label="Lessons Created"
            value={filteredLessons}
            sublabel="This week"
            icon={BookOpen}
          />
          <StatCard
            label="Assessments Made"
            value={filteredAssessments}
            sublabel="This week"
            icon={FileText}
          />
          <StatCard
            label="Quizzes Conducted"
            value={filteredQuizzes}
            sublabel="This week"
            icon={HelpCircle}
          />
          <StatCard
            label="Submission Rate"
            value={`${filteredRecords.length > 0 ? Math.round((filteredLessons / filteredRecords.length) * 100) : 0}%`}
            sublabel="This week"
            icon={TrendingUp}
          />
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <WeeklyActivityChart data={weeklyData} />
          </div>
          <div className="lg:col-span-2">
            <AIPulseSummary
              mostActive={insights.mostActive}
              leastActive={insights.leastActive}
              topSubject={insights.topSubject}
              activeTeachers={insights.activeTeachers}
            />
          </div>
        </div>

        {/* Teacher list table */}
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Teacher Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Teacher</th>
                  <th className="pb-3 pr-4 font-medium">Subjects</th>
                  <th className="pb-3 pr-4 font-medium text-center">Lessons</th>
                  <th className="pb-3 pr-4 font-medium text-center">Quizzes</th>
                  <th className="pb-3 pr-4 font-medium text-center">Assessments</th>
                  <th className="pb-3 font-medium text-center">Total</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.teacher_id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4">
                      <div>
                        <span className="font-medium text-foreground">{t.teacher_name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{t.teacher_id}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {t.subjects.join(", ")}
                    </td>
                    <td className="py-3 pr-4 text-center text-foreground">{t.lessons}</td>
                    <td className="py-3 pr-4 text-center text-foreground">{t.quizzes}</td>
                    <td className="py-3 pr-4 text-center text-foreground">{t.assessments}</td>
                    <td className="py-3 text-center font-medium text-foreground">{t.totalActivities}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/teachers/${t.teacher_id}`}
                        className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
