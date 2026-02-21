"use client"

import { useEffect, useState } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { RecentActivity } from "@/components/recent-activity"

import { User, Mail, BookOpen, Calendar } from "lucide-react"

export default function TeacherProfilePage() {
  const { user, token } = useAuth()

  const [teacher, setTeacher] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/teacher/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (data.success) {
          setTeacher(data.data.teacher)
          setActivities(data.data.activities)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  if (loading) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!teacher) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Profile not available.</p>
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
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 bg-primary text-primary-foreground">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                {teacher.name}
              </h2>

              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <User className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">Teacher ID</p>
                <p className="text-sm font-medium text-foreground">
                  {teacher.teacherId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Mail className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <BookOpen className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">Subjects</p>

                <div className="mt-1 flex flex-wrap gap-1">
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
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Grades Taught
                </p>

                <p className="text-sm font-medium text-foreground">
                  {teacher.grades
                    ?.sort((a: number, b: number) => a - b)
                    .map((g: number) => `Class ${g}`)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <RecentActivity activities={activities} limit={10} />
      </div>
    </DashboardLayout>
  )
}