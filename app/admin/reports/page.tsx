"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { getTeachers, getWeeklyActivity, exportToCSV, activityRecords } from "@/lib/data"
import { WeeklyActivityChart } from "@/components/weekly-activity-chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ReportsPage() {
  const teachers = getTeachers()
  const weeklyData = getWeeklyActivity()

  const handleExportAll = () => {
    const header = "Teacher ID,Teacher Name,Grade,Subject,Activity Type,Created At"
    const rows = activityRecords
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(
        (r) =>
          `${r.teacher_id},${r.teacher_name},${r.grade},${r.subject},${r.activity_type},${r.created_at}`
      )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "savra_all_teachers_report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportTeacher = (teacherId: string, name: string) => {
    const csv = exportToCSV(teacherId)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name.replace(/\s+/g, "_")}_report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Export activity data and view analytics
            </p>
          </div>
          <Button onClick={handleExportAll} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export All (CSV)
          </Button>
        </div>

        <WeeklyActivityChart data={weeklyData} />

        {/* Per-teacher export */}
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Per-Teacher Reports</h3>
          <div className="flex flex-col gap-2">
            {teachers.map((t) => (
              <div
                key={t.teacher_id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-foreground">{t.teacher_name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {t.totalActivities} activities
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportTeacher(t.teacher_id, t.teacher_name)}
                  className="gap-1 text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
