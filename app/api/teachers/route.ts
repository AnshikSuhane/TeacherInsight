import { NextResponse } from "next/server"
import { getTeacherById, getActivitiesByTeacher, getClassBreakdown, getWeeklyActivity, exportToCSV } from "@/lib/data"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const teacher = getTeacherById(id)
  if (!teacher) {
    return NextResponse.json(
      { success: false, error: "Teacher not found" },
      { status: 404 }
    )
  }

  const activities = getActivitiesByTeacher(id)
  const classBreakdown = getClassBreakdown(id)
  const weeklyActivity = getWeeklyActivity(id)

  const url = new URL(request.url)
  const format = url.searchParams.get("format")

  if (format === "csv") {
    const csv = exportToCSV(id)
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${teacher.teacher_name.replace(/\s+/g, "_")}_report.csv"`,
      },
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      teacher,
      activities,
      classBreakdown,
      weeklyActivity,
    },
  })
}
