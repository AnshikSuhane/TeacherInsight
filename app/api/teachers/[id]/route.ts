import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"

import Teacher from "@/models/teacher.models"
import Activity from "@/models/Activity.models"
import ClassModel from "@/models/grade.models"

function escapeCSV(value: string | number) {
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { id } = params

    const teacher = await Teacher.findOne({
      teacherId: id,
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      )
    }

    const activities = await Activity.find({
      teacher: teacher._id,
    })
      .populate("class")
      .sort({ createdAt: -1 })

    const classMap = new Map<number, any>()

    for (const a of activities) {
      const grade = (a.class as any).grade

      if (!classMap.has(grade)) {
        classMap.set(grade, {
          className: `Class ${grade}`,
          lessons: 0,
          quizzes: 0,
          assessments: 0,
          total: 0,
        })
      }

      const item = classMap.get(grade)

      if (a.activityType === "Lesson Plan") item.lessons++
      else if (a.activityType === "Quiz") item.quizzes++
      else if (a.activityType === "Question Paper")
        item.assessments++

      item.total++
    }

    const classBreakdown = Array.from(classMap.values()).sort(
      (a, b) =>
        Number(a.className.replace("Class ", "")) -
        Number(b.className.replace("Class ", ""))
    )

    const weeklyActivity = await Activity.aggregate([
      {
        $match: {
          teacher: teacher._id,
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          lessons: {
            $sum: {
              $cond: [
                { $eq: ["$activityType", "Lesson Plan"] },
                1,
                0,
              ],
            },
          },

          quizzes: {
            $sum: {
              $cond: [
                { $eq: ["$activityType", "Quiz"] },
                1,
                0,
              ],
            },
          },

          assessments: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$activityType",
                    "Question Paper",
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      { $sort: { _id: 1 } },
    ])

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format")

    if (format === "csv") {
      const header =
        "Teacher ID,Teacher Name,Grade,Subject,Activity Type,Created At"

      const rows = activities.map((r: any) =>
        [
          escapeCSV(teacher.teacherId),
          escapeCSV(teacher.name),
          escapeCSV(r.class.grade),
          escapeCSV(r.subject),
          escapeCSV(r.activityType),
          escapeCSV(r.createdAt.toISOString()),
        ].join(",")
      )

      const csv = [header, ...rows].join("\n")

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${teacher.name.replace(
            /\s+/g,
            "_"
          )}_report.csv"`,
          "Cache-Control": "no-store",
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        teacher: {
          id: teacher.teacherId,
          name: teacher.name,
        },
        activities,
        classBreakdown,
        weeklyActivity,
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