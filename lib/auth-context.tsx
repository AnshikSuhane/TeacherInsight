"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "teacher"
}

interface AuthContextType {
  user: User | null
  token:string
  isAuthenticated: boolean
  isHydrated: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string>("")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }

    setIsHydrated(true)
  }, [])

  const login = (user: User) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    setToken("")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isHydrated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return ctx
}