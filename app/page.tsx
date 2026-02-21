"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

import { ArrowRight, BarChart3, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { user, isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return

    if (isAuthenticated && user?.role) {
      router.replace(
        user.role === "admin"
          ? "/admin/dashboard"
          : "/teacher/dashboard"
      )
    }
  }, [isHydrated, isAuthenticated, user, router])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              S
            </span>
          </div>

          <span className="text-xl font-bold tracking-tight text-primary">
            SAVRA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground">
              Log In
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            <BarChart3 className="h-4 w-4" />
            Admin Companion
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
            See What{"'"}s Happening Across Your School
          </h1>

          <p className="mb-10 text-pretty text-lg text-muted-foreground leading-relaxed lg:text-xl">
            Track teacher performance, monitor lesson creation, quizzes, and
            assessments. Get real-time insights to make informed decisions for
            your school.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Teacher Monitoring",
              description:
                "Track activity and engagement across all teachers in real-time.",
            },
            {
              icon: BookOpen,
              title: "Content Analytics",
              description:
                "See lessons, quizzes, and assessments created each week.",
            },
            {
              icon: BarChart3,
              title: "Performance Insights",
              description:
                "Class-wise breakdowns and per-teacher analysis at your fingertips.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 text-left text-card-foreground"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mb-1 text-sm font-semibold text-card-foreground">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        SAVRA - School Administration & Visibility for Real-time Analytics
      </footer>
    </div>
  )
}