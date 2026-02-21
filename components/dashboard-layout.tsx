"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  requiredRole?: "admin" | "teacher"
}

export function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const { user, isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect until auth state has been restored from localStorage
    if (!isHydrated) return

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace(
        user?.role === "admin"
          ? "/admin/dashboard"
          : "/teacher/dashboard"
      )
    }
  }, [isHydrated, isAuthenticated, user, requiredRole, router])

  if (
    !isHydrated ||
    !isAuthenticated ||
    (requiredRole && user?.role !== requiredRole)
  ) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}