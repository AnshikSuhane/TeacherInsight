import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"

import Teacher from "@/models/teacher.models"
import Activity from "@/models/Activity.models"
import ClassModel from "@/models/grade.models"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const user = verifyToken(token)

    await dbConnect()

    const { searchParams } = new URL(request.url)

    const gradeParam = searchParams.get("grade")
    const subject = searchParams.get("subject")
    const teacherIdParam = searchParams.get("teacherId")
    const limitParam = searchParams.get("limit")

    const filter: any = {}

    if (subject && subject !== "all") {
      filter.subject = subject
    }

    if (user.role === "teacher") {
      filter.teacher = (
        await Teacher.findOne({ teacherId: user.teacherId })
      )?._id
    }

    if (user.role === "admin" && teacherIdParam) {
      const teacher = await Teacher.findOne({ teacherId: teacherIdParam })

      if (!teacher) {
        return NextResponse.json(
          { success: false, error: "Teacher not found" },
          { status: 404 }
        )
      }

      filter.teacher = teacher._id
    }

    if (gradeParam && gradeParam !== "all") {
      const grade = Number(gradeParam)

      if (isNaN(grade)) {
        return NextResponse.json(
          { success: false, error: "Invalid grade" },
          { status: 400 }
        )
      }

      const classDoc = await ClassModel.findOne({ grade })

      if (!classDoc) {
        return NextResponse.json({
          success: true,
          data: [],
          total: 0,
        })
      }

      filter.class = classDoc._id
    }

    let query = Activity.find(filter)
      .populate("teacher")
      .populate("class")
      .sort({ createdAt: -1 })

    if (limitParam) {
      const limit = Number(limitParam)
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit)
      }
    }

    const data = await query.exec()

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
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