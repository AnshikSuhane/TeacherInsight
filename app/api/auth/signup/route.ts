import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { dbConnect } from "@/lib/db"
import User from "@/models/user.models"

const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET not defined")
  }
  return secret
})()

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, email, role, password } = body

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    if (!["admin", "teacher"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Role must be admin or teacher" },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    })

    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      success: true,
      token,
      data: {
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        redirectTo:
          newUser.role === "admin"
            ? "/admin/dashboard"
            : "/teacher/dashboard",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    )
  }
}