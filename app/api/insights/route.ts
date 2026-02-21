import { NextResponse } from "next/server"

import { dbConnect } from "@/lib/db"

import Activity from "@/models/Activity.models"
import Teacher from "@/models/teacher.models"
import ClassModel from "@/models/grade.models"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)

    const gradeParam = searchParams.get("grade")
    const subject = searchParams.get("subject")

    const filter: any = {}

    if (subject && subject !== "all") {
      filter.subject = subject
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
          data: {
            activeTeachers: 0,
            totalLessons: 0,
            totalQuizzes: 0,
            totalAssessments: 0,
            weeklyActivity: [],
            filters: {
              availableGrades: [],
              availableSubjects: [],
            },
            aiInsights: null,
          },
        })
      }

      filter.class = classDoc._id
    }

    const activities = await Activity.find(filter)
      .populate("teacher")
      .populate("class")

    const lessons = activities.filter(
      (r) => r.activityType === "Lesson Plan"
    ).length

    const quizzes = activities.filter(
      (r) => r.activityType === "Quiz"
    ).length

    const assessments = activities.filter(
      (r) => r.activityType === "Question Paper"
    ).length

    const teacherIds = new Set(
      activities.map((r: any) => r.teacher._id.toString())
    )

    const weekly = await Activity.aggregate([
      { $match: filter },

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

    const teachers = await Teacher.find()

    const teacherStats = await Promise.all(
      teachers.map(async (t) => {
        const count = await Activity.countDocuments({
          teacher: t._id,
        })

        return {
          id: t._id,
          name: t.name,
          total: count,
        }
      })
    )

    const mostActive = teacherStats.sort(
      (a, b) => b.total - a.total
    )[0]

    const leastActive = teacherStats.sort(
      (a, b) => a.total - b.total
    )[0]

    const subjects = await Activity.distinct("subject")
    const grades = await ClassModel.distinct("grade")

    return NextResponse.json({
      success: true,
      data: {
        activeTeachers: teacherIds.size,
        totalLessons: lessons,
        totalQuizzes: quizzes,
        totalAssessments: assessments,
        weeklyActivity: weekly,

        filters: {
          availableGrades: grades.sort((a, b) => a - b),
          availableSubjects: subjects,
        },

        aiInsights: {
          mostActiveTeacher: mostActive?.name || null,
          leastActiveTeacher: leastActive?.name || null,
          topSubject: subjects[0] || null,
        },
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