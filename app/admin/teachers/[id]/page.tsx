"use client"

import { use, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { ClassBreakdownChart } from "@/components/class-breakdown-chart"
import { RecentActivity } from "@/components/recent-activity"
import { getTeacherById, getActivitiesByTeacher, getClassBreakdown, exportToCSV } from "@/lib/data"
import { BookOpen, HelpCircle, FileText, AlertTriangle, ArrowLeft, Download, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const teacher = getTeacherById(id)
  const activities = teacher ? getActivitiesByTeacher(id) : []
  const classBreakdown = teacher ? getClassBreakdown(id) : []

  const handleExport = () => {
    if (!teacher) return
    const csv = exportToCSV(id)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${teacher.teacher_name.replace(/\s+/g, "_")}_report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!teacher) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <p className="mb-4 text-lg text-muted-foreground">Teacher not found</p>
          <Link href="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const initials = teacher.teacher_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Engagement note
  const avgPerClass = teacher.totalActivities / (teacher.grades.length || 1)
  const lowEngagement = avgPerClass < 3

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        {/* Back button */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Teacher header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 bg-secondary text-secondary-foreground">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{teacher.teacher_name}</h1>
              <p className="text-sm text-muted-foreground">Performance Overview</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">Subject:</span>{" "}
                  {teacher.subjects.join(", ")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">Grade Taught:</span>{" "}
                  {teacher.grades.sort((a, b) => a - b).map((g) => `Class ${g}`).join(", ")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs defaultValue="week">
              <TabsList>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Lessons Created"
            value={teacher.lessons}
            icon={BookOpen}
            variant={teacher.lessons > 0 ? "accent" : "default"}
          />
          <StatCard
            label="Quizzes Conducted"
            value={teacher.quizzes}
            icon={HelpCircle}
            variant={teacher.quizzes > 0 ? "accent" : "default"}
          />
          <StatCard
            label="Assessments Assigned"
            value={teacher.assessments}
            icon={FileText}
            variant={teacher.assessments > 0 ? "accent" : "default"}
          />
          {/* Engagement Note */}
          <div className={`flex flex-col gap-2 rounded-xl border p-5 ${lowEngagement ? "border-savra-amber/30 bg-savra-amber/5" : "border-savra-green/30 bg-savra-green/5"}`}>
            <div className="flex items-center gap-2">
              {lowEngagement ? (
                <AlertTriangle className="h-4 w-4 text-savra-amber" />
              ) : (
                <User className="h-4 w-4 text-savra-green" />
              )}
              <span className="text-sm font-medium text-foreground">
                {lowEngagement ? "Low Engagement Note" : "Good Engagement"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lowEngagement
                ? `Average score is ${avgPerClass.toFixed(1)} activities/class. Consider reviewing teaching methods.`
                : `Strong activity with ${avgPerClass.toFixed(1)} activities per class on average.`}
            </p>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ClassBreakdownChart data={classBreakdown} />
          </div>
          <div className="lg:col-span-2">
            <RecentActivity activities={activities} />
          </div>
        </div>

        {/* Export */}
        <div className="flex justify-end">
          <Button
            onClick={handleExport}
            className="gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20"
          >
            <Download className="h-4 w-4" />
            Export Report (CSV)
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
