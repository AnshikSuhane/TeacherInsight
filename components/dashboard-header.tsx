"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DashboardHeaderProps {
  title: string
  subtitle: string
  grades: number[]
  subjects: string[]
  selectedGrade: string
  selectedSubject: string
  onGradeChange: (v: string) => void
  onSubjectChange: (v: string) => void
}

export function DashboardHeader({
  title,
  subtitle,
  grades,
  subjects,
  selectedGrade,
  selectedSubject,
  onGradeChange,
  onSubjectChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ask Savra AI"
            className="w-48 bg-card pl-9 text-foreground"
            readOnly
          />
        </div>
        <Select value={selectedGrade} onValueChange={onGradeChange}>
          <SelectTrigger className="w-[120px] bg-primary text-primary-foreground border-primary">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map((g) => (
              <SelectItem key={g} value={String(g)}>
                Grade {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-[140px] bg-card text-foreground">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
