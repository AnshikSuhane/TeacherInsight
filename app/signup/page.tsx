"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAuth } from "@/lib/auth-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"admin" | "teacher">("teacher")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role: activeTab,
          password,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Signup failed.")
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
            Join the SAVRA Platform
          </h2>

          <p className="text-pretty text-primary-foreground/80 leading-relaxed">
            Create your account to start monitoring teacher performance,
            tracking content creation, and gaining actionable insights
            across your school.
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
              <span className="text-sm font-bold text-primary-foreground">
                S
              </span>
            </div>

            <span className="text-xl font-bold tracking-tight text-primary">
              SAVRA
            </span>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Create Account
          </h1>

          <p className="mb-6 text-sm text-muted-foreground">
            Sign up to access the SAVRA platform
          </p>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as "admin" | "teacher")
              setError("")
            }}
          >
            <TabsList className="mb-6 w-full grid grid-cols-2">
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <SignupForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={error}
                onSubmit={handleSubmit}
                role="admin"
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="teacher">
              <SignupForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={error}
                onSubmit={handleSubmit}
                role="teacher"
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignupForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  error,
  onSubmit,
  role,
  isLoading,
}: {
  name: string
  setName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  confirmPassword: string
  setConfirmPassword: (v: string) => void
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
        <Label htmlFor={`name-${role}`} className="text-foreground">
          Full Name
        </Label>

        <Input
          id={`name-${role}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-card text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`email-${role}`} className="text-foreground">
          Email
        </Label>

        <Input
          id={`email-${role}`}
          type="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card pr-10 text-foreground"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor={`confirm-${role}`}
          className="text-foreground"
        >
          Confirm Password
        </Label>

        <Input
          id={`confirm-${role}`}
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="bg-card text-foreground"
        />
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
            Creating account...
          </>
        ) : (
          `Create ${role === "admin" ? "Admin" : "Teacher"} Account`
        )}
      </Button>
    </form>
  )
}