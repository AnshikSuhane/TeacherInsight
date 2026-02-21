"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

import { StatCard } from "@/components/stat-card"
import { ClassBreakdownChart } from "@/components/class-breakdown-chart"
import { WeeklyActivityChart } from "@/components/weekly-activity-chart"
import { RecentActivity } from "@/components/recent-activity"

import {
  BookOpen,
  HelpCircle,
  FileText,
  Download,
  BarChart3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TeacherDashboardPage() {
  const { user, token } = useAuth()

  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [classBreakdown, setClassBreakdown] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    if (!user || !token) return

    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/teacher/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (data.success) {
          setTeacher(data.data.teacher)
          setActivities(data.data.activities)
          setClassBreakdown(data.data.classBreakdown)
          setWeeklyData(data.data.weeklyActivity)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [user, token])

  const handleExport = async () => {
    if (!token) return

    const res = await fetch("/api/teacher/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "my_report.csv"
    a.click()

    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!teacher) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Welcome!</p>
          <p className="text-sm text-muted-foreground">
            Your teacher profile is not linked yet. Contact your admin.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  const initials = teacher.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 bg-primary text-primary-foreground">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {teacher.name}
              </h1>

              <p className="text-sm text-muted-foreground">
                My Dashboard
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {teacher.subjects?.map((s: string) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-xs bg-secondary text-secondary-foreground"
                  >
                    {s}
                  </Badge>
                ))}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Grades:{" "}
                {teacher.grades
                  ?.sort((a: number, b: number) => a - b)
                  .map((g: number) => `Class ${g}`)
                  .join(", ")}
              </p>
            </div>
          </div>

          <Button
            onClick={handleExport}
            variant="outline"
            className="gap-2 text-foreground"
          >
            <Download className="h-4 w-4" />
            Export My Report
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Lessons Created"
            value={teacher.lessons}
            icon={BookOpen}
            variant="accent"
          />

          <StatCard
            label="Quizzes Conducted"
            value={teacher.quizzes}
            icon={HelpCircle}
          />

          <StatCard
            label="Assessments Assigned"
            value={teacher.assessments}
            icon={FileText}
          />

          <StatCard
            label="Total Activities"
            value={teacher.totalActivities}
            icon={BarChart3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyActivityChart data={weeklyData} />
          <ClassBreakdownChart data={classBreakdown} />
        </div>

        <RecentActivity activities={activities} limit={10} />
      </div>
    </DashboardLayout>
  )
}