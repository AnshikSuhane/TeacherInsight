"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  School,
  FileText,
  LogOut,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Teachers", href: "/admin/teachers", icon: Users },
  { label: "Classrooms", href: "/admin/classrooms", icon: School },
  { label: "Reports", href: "/admin/reports", icon: FileText },
]

const teacherNav = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/teacher/profile", icon: User },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { user, logout, isHydrated } = useAuth()

  if (!isHydrated) {
    return null
  }

  const navItems =
    user?.role === "admin" ? adminNav : teacherNav

  const handleLogout = () => {
    logout()
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">
            S
          </span>
        </div>

        <span className="text-xl font-bold tracking-tight text-primary">
          SAVRA
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main
        </p>

        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/")

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 bg-savra-amber text-accent-foreground">
            <AvatarFallback className="bg-savra-amber text-accent-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {user?.name || "Guest"}
            </p>

            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {user?.role === "admin"
                ? "School Admin"
                : "Teacher"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}