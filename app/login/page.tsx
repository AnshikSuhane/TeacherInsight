"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAuth } from "@/lib/auth-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"admin" | "teacher">("admin")

  const { login, isAuthenticated, user, isHydrated } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.push(
        user.role === "admin"
          ? "/admin/dashboard"
          : "/teacher/dashboard"
      )
    }
  }, [isHydrated, isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")

    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role: activeTab,
          password,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Login failed.")
        setIsLoading(false)
        return
      }

      login(data.data.user)

      router.push(data.data.redirectTo)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials =
    activeTab === "admin"
      ? [{ email: "admin@savra.edu", label: "Admin - Shauryaman Ray" }]
      : [
          { email: "anita@savra.edu", label: "Anita Sharma" },
          { email: "rahul@savra.edu", label: "Rahul Verma" },
          { email: "pooja@savra.edu", label: "Pooja Mehta" },
          { email: "vikas@savra.edu", label: "Vikas Nair" },
          { email: "neha@savra.edu", label: "Neha Kapoor" },
        ]

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden flex-1 flex-col justify-between bg-primary p-12 lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground">
            <span className="text-sm font-bold text-primary">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary-foreground">
            SAVRA
          </span>
        </div>

        <div>
          <h2 className="mb-4 text-balance text-3xl font-bold text-primary-foreground">
            Welcome back to your Admin Companion
          </h2>

          <p className="text-pretty text-primary-foreground/80 leading-relaxed">
            Monitor teacher performance, track lesson creation, and gain real-time
            insights across your entire school ecosystem.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/60">
          School Administration & Visibility for Real-time Analytics
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>

            <span className="text-xl font-bold tracking-tight text-primary">
              SAVRA
            </span>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Log In
          </h1>

          <p className="mb-6 text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as "admin" | "teacher")
              setError("")
              setEmail("")
            }}
          >
            <TabsList className="mb-6 w-full grid grid-cols-2">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={error}
                onSubmit={handleSubmit}
                role="admin"
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="teacher">
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={error}
                onSubmit={handleSubmit}
                role="teacher"
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Demo Credentials
            </p>

            <div className="flex flex-col gap-1.5">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => {
                    setEmail(cred.email)
                    setPassword("demo123")
                  }}
                  className="rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <span className="font-medium">
                    {cred.label}
                  </span>

                  <span className="ml-2 text-muted-foreground">
                    {cred.email}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don{"'"}t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  onSubmit,
  role,
  isLoading,
}: {
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  showPassword: boolean
  setShowPassword: (v: boolean) => void
  error: string
  onSubmit: (e: React.FormEvent) => void
  role: string
  isLoading: boolean
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`email-${role}`} className="text-foreground">
          Email
        </Label>

        <Input
          id={`email-${role}`}
          type="email"
          placeholder={
            role === "admin"
              ? "admin@savra.edu"
              : "teacher@savra.edu"
          }
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-card text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`password-${role}`} className="text-foreground">
          Password
        </Label>

        <div className="relative">
          <Input
            id={`password-${role}`}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card pr-10 text-foreground"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          `Log In as ${role === "admin" ? "Admin" : "Teacher"}`
        )}
      </Button>
    </form>
  )
}