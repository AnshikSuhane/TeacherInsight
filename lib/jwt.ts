import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || ""

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined")
}

export interface JwtPayload {
  userId: string
  role: "admin" | "teacher"
  teacherId?: string
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload
}