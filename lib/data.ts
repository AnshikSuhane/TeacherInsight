// ── Teacher Activity Dataset ──
// Each record: teacher_id, teacher_name, activity_type, created_at, subject, class (grade)

export interface ActivityRecord {
  teacher_id: string
  teacher_name: string
  grade: number
  subject: string
  activity_type: "Lesson Plan" | "Quiz" | "Question Paper"
  created_at: string
}

// Deduplicate based on composite key: teacher_id + grade + subject + activity_type + created_at
function deduplicateRecords(records: ActivityRecord[]): ActivityRecord[] {
  const seen = new Set<string>()
  return records.filter((r) => {
    const key = `${r.teacher_id}|${r.grade}|${r.subject}|${r.activity_type}|${r.created_at}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const rawRecords: ActivityRecord[] = [
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 10, subject: "Social Studies", activity_type: "Quiz", created_at: "2026-02-12 19:07:41" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 7, subject: "English", activity_type: "Question Paper", created_at: "2026-02-13 15:31:51" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 10, subject: "Social Studies", activity_type: "Lesson Plan", created_at: "2026-02-11 19:15:55" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 7, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-17 20:35:33" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 9, subject: "Social Studies", activity_type: "Question Paper", created_at: "2026-02-15 16:51:32" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Quiz", created_at: "2026-02-14 15:22:29" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Quiz", created_at: "2026-02-12 12:26:22" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 9, subject: "Science", activity_type: "Quiz", created_at: "2026-02-17 09:21:32" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 9, subject: "Science", activity_type: "Question Paper", created_at: "2026-02-12 11:38:24" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Question Paper", created_at: "2026-02-17 19:07:47" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-11 17:53:57" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Question Paper", created_at: "2026-02-16 11:26:52" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 7, subject: "English", activity_type: "Lesson Plan", created_at: "2026-02-16 15:41:50" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Question Paper", created_at: "2026-02-11 17:54:16" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-17 19:19:56" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 9, subject: "Social Studies", activity_type: "Quiz", created_at: "2026-02-16 19:12:33" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Question Paper", created_at: "2026-02-13 09:16:06" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Quiz", created_at: "2026-02-15 11:36:03" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 9, subject: "Social Studies", activity_type: "Lesson Plan", created_at: "2026-02-11 13:06:29" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Quiz", created_at: "2026-02-15 13:31:42" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Question Paper", created_at: "2026-02-16 11:44:31" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-18 18:45:43" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Question Paper", created_at: "2026-02-12 19:19:44" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 8, subject: "Science", activity_type: "Quiz", created_at: "2026-02-14 13:57:07" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 8, subject: "Science", activity_type: "Question Paper", created_at: "2026-02-12 18:01:59" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 7, subject: "Mathematics", activity_type: "Question Paper", created_at: "2026-02-14 10:36:09" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-18 16:32:47" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 10, subject: "Social Studies", activity_type: "Quiz", created_at: "2026-02-15 15:59:00" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 8, subject: "Science", activity_type: "Lesson Plan", created_at: "2026-02-15 13:31:36" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 9, subject: "Social Studies", activity_type: "Lesson Plan", created_at: "2026-02-15 16:32:23" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Question Paper", created_at: "2026-02-18 09:12:05" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 9, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-18 16:26:04" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 9, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-16 17:14:47" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Question Paper", created_at: "2026-02-12 17:47:58" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Quiz", created_at: "2026-02-18 14:05:20" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 8, subject: "Science", activity_type: "Quiz", created_at: "2026-02-14 09:54:01" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 9, subject: "Science", activity_type: "Lesson Plan", created_at: "2026-02-12 18:27:09" },
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Quiz", created_at: "2026-02-14 15:43:38" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 8, subject: "Science", activity_type: "Lesson Plan", created_at: "2026-02-18 15:48:08" },
  { teacher_id: "T002", teacher_name: "Rahul Verma", grade: 9, subject: "Science", activity_type: "Lesson Plan", created_at: "2026-02-16 13:31:34" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Lesson Plan", created_at: "2026-02-14 19:49:54" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 10, subject: "Mathematics", activity_type: "Quiz", created_at: "2026-02-14 11:55:18" },
  { teacher_id: "T003", teacher_name: "Pooja Mehta", grade: 6, subject: "English", activity_type: "Lesson Plan", created_at: "2026-02-16 15:33:27" },
  { teacher_id: "T005", teacher_name: "Neha Kapoor", grade: 9, subject: "Mathematics", activity_type: "Lesson Plan", created_at: "2026-02-18 11:51:37" },
  // Intentional duplicates to test deduplication
  { teacher_id: "T001", teacher_name: "Anita Sharma", grade: 8, subject: "Mathematics", activity_type: "Quiz", created_at: "2026-02-14 15:43:38" },
  { teacher_id: "T004", teacher_name: "Vikas Nair", grade: 10, subject: "Social Studies", activity_type: "Quiz", created_at: "2026-02-12 19:07:41" },
]

export const activityRecords: ActivityRecord[] = deduplicateRecords(rawRecords)

// ── Derived helpers ──

export interface TeacherSummary {
  teacher_id: string
  teacher_name: string
  subjects: string[]
  grades: number[]
  lessons: number
  quizzes: number
  assessments: number
  totalActivities: number
  recentActivity: ActivityRecord | null
}

export function getTeachers(): TeacherSummary[] {
  const map = new Map<string, TeacherSummary>()

  for (const r of activityRecords) {
    let t = map.get(r.teacher_id)
    if (!t) {
      t = {
        teacher_id: r.teacher_id,
        teacher_name: r.teacher_name,
        subjects: [],
        grades: [],
        lessons: 0,
        quizzes: 0,
        assessments: 0,
        totalActivities: 0,
        recentActivity: null,
      }
      map.set(r.teacher_id, t)
    }
    if (!t.subjects.includes(r.subject)) t.subjects.push(r.subject)
    if (!t.grades.includes(r.grade)) t.grades.push(r.grade)

    if (r.activity_type === "Lesson Plan") t.lessons++
    else if (r.activity_type === "Quiz") t.quizzes++
    else if (r.activity_type === "Question Paper") t.assessments++
    t.totalActivities++

    if (!t.recentActivity || new Date(r.created_at) > new Date(t.recentActivity.created_at)) {
      t.recentActivity = r
    }
  }

  return Array.from(map.values()).sort((a, b) => a.teacher_id.localeCompare(b.teacher_id))
}

export function getTeacherById(id: string): TeacherSummary | undefined {
  return getTeachers().find((t) => t.teacher_id === id)
}

export function getActivitiesByTeacher(id: string): ActivityRecord[] {
  return activityRecords
    .filter((r) => r.teacher_id === id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Weekly breakdown for chart
export interface DailyActivity {
  date: string
  lessons: number
  quizzes: number
  assessments: number
}

export function getWeeklyActivity(teacherId?: string): DailyActivity[] {
  const filtered = teacherId
    ? activityRecords.filter((r) => r.teacher_id === teacherId)
    : activityRecords

  const map = new Map<string, DailyActivity>()

  for (const r of filtered) {
    const date = r.created_at.split(" ")[0]
    let d = map.get(date)
    if (!d) {
      d = { date, lessons: 0, quizzes: 0, assessments: 0 }
      map.set(date, d)
    }
    if (r.activity_type === "Lesson Plan") d.lessons++
    else if (r.activity_type === "Quiz") d.quizzes++
    else if (r.activity_type === "Question Paper") d.assessments++
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

// Class-wise breakdown for a teacher
export interface ClassBreakdown {
  className: string
  lessons: number
  quizzes: number
  assessments: number
  total: number
}

export function getClassBreakdown(teacherId: string): ClassBreakdown[] {
  const records = activityRecords.filter((r) => r.teacher_id === teacherId)
  const map = new Map<number, ClassBreakdown>()

  for (const r of records) {
    let c = map.get(r.grade)
    if (!c) {
      c = { className: `Class ${r.grade}`, lessons: 0, quizzes: 0, assessments: 0, total: 0 }
      map.set(r.grade, c)
    }
    if (r.activity_type === "Lesson Plan") c.lessons++
    else if (r.activity_type === "Quiz") c.quizzes++
    else if (r.activity_type === "Question Paper") c.assessments++
    c.total++
  }

  return Array.from(map.values()).sort((a, b) =>
    parseInt(a.className.replace("Class ", "")) - parseInt(b.className.replace("Class ", ""))
  )
}

// Global insights
export function getGlobalInsights() {
  const teachers = getTeachers()
  const totalLessons = teachers.reduce((s, t) => s + t.lessons, 0)
  const totalQuizzes = teachers.reduce((s, t) => s + t.quizzes, 0)
  const totalAssessments = teachers.reduce((s, t) => s + t.assessments, 0)

  // Find teacher with highest workload
  const mostActive = [...teachers].sort((a, b) => b.totalActivities - a.totalActivities)[0]

  // Find most common subject
  const subjectCount = new Map<string, number>()
  for (const r of activityRecords) {
    subjectCount.set(r.subject, (subjectCount.get(r.subject) || 0) + 1)
  }
  const topSubject = Array.from(subjectCount.entries()).sort((a, b) => b[1] - a[1])[0]

  // Find least active teacher
  const leastActive = [...teachers].sort((a, b) => a.totalActivities - b.totalActivities)[0]

  return {
    activeTeachers: teachers.length,
    totalLessons,
    totalQuizzes,
    totalAssessments,
    mostActive,
    leastActive,
    topSubject: topSubject ? { subject: topSubject[0], count: topSubject[1] } : null,
    allSubjects: Array.from(new Set(activityRecords.map((r) => r.subject))),
    allGrades: Array.from(new Set(activityRecords.map((r) => r.grade))).sort((a, b) => a - b),
  }
}

// User types for auth simulation
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "teacher"
  teacher_id?: string
}

export const demoUsers: User[] = [
  { id: "U001", name: "Shauryaman Ray", email: "admin@savra.edu", role: "admin" },
  { id: "U002", name: "Anita Sharma", email: "anita@savra.edu", role: "teacher", teacher_id: "T001" },
  { id: "U003", name: "Rahul Verma", email: "rahul@savra.edu", role: "teacher", teacher_id: "T002" },
  { id: "U004", name: "Pooja Mehta", email: "pooja@savra.edu", role: "teacher", teacher_id: "T003" },
  { id: "U005", name: "Vikas Nair", email: "vikas@savra.edu", role: "teacher", teacher_id: "T004" },
  { id: "U006", name: "Neha Kapoor", email: "neha@savra.edu", role: "teacher", teacher_id: "T005" },
]

// CSV export
export function exportToCSV(teacherId: string): string {
  const records = getActivitiesByTeacher(teacherId)
  const header = "Teacher ID,Teacher Name,Grade,Subject,Activity Type,Created At"
  const rows = records.map(
    (r) => `${r.teacher_id},${r.teacher_name},${r.grade},${r.subject},${r.activity_type},${r.created_at}`
  )
  return [header, ...rows].join("\n")
}
