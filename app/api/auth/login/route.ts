import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { dbConnect } from "@/lib/db"
import User from "@/models/user.models"

const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET not defined")
  return secret
})()

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (user.role !== role) {
      return NextResponse.json(
        { success: false, error: "Invalid role selected" },
        { status: 403 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      success: true,
      token,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectTo:
          user.role === "admin"
            ? "/admin/dashboard"
            : "/teacher/dashboard",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}