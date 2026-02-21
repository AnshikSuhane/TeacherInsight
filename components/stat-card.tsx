import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string | null | undefined
  sublabel?: string
  icon?: LucideIcon
  variant?: "default" | "warning" | "accent"
}

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const displayValue =
    value === null || value === undefined ? "--" : value

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-5 transition-shadow hover:shadow-md",
        variant === "default" &&
          "border-border bg-card text-card-foreground",
        variant === "warning" &&
          "border-savra-amber/30 bg-savra-amber/5 text-card-foreground",
        variant === "accent" &&
          "border-savra-green/30 bg-savra-green/5 text-card-foreground"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>

        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <span className="text-3xl font-bold tracking-tight text-foreground">
        {displayValue}
      </span>

      {sublabel && (
        <span className="text-xs text-muted-foreground">
          {sublabel}
        </span>
      )}
    </div>
  )
}