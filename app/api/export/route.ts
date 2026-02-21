import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"

import Teacher from "@/models/teacher.models"
import Activity from "@/models/Activity.models"

function escapeCSV(value: string | number) {
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    let activities: any[] = []
    let filename = "savra_all_teachers_report.csv"

    if (teacherId) {
      const teacher = await Teacher.findOne({ teacherId })

      if (!teacher) {
        return NextResponse.json(
          { success: false, error: "Teacher not found" },
          { status: 404 }
        )
      }

      activities = await Activity.find({
        teacher: teacher._id,
      })
        .populate("teacher")
        .populate("class")
        .sort({ createdAt: -1 })

      filename = `${teacher.name.replace(
        /\s+/g,
        "_"
      )}_report.csv`
    } else {
      activities = await Activity.find()
        .populate("teacher")
        .populate("class")
        .sort({ createdAt: -1 })
    }

    const header =
      "Teacher ID,Teacher Name,Grade,Subject,Activity Type,Created At"

    const rows = activities.map((r: any) => {
      return [
        escapeCSV(r.teacher.teacherId),
        escapeCSV(r.teacher.name),
        escapeCSV(r.class.grade),
        escapeCSV(r.subject),
        escapeCSV(r.activityType),
        escapeCSV(r.createdAt.toISOString()),
      ].join(",")
    })

    const csv = [header, ...rows].join("\n")

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
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