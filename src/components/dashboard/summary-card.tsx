import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  flag?: "amber" | "rust" | "green"
}

export function SummaryCard({ title, value, subtitle, icon, flag }: SummaryCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden",
      flag === "amber" && "border-amber/30",
      flag === "rust" && "border-rust/30",
      flag === "green" && "border-emerald-500/30",
    )}>
      {icon && <div className="absolute right-3 top-3 text-zinc-300 dark:text-zinc-600">{icon}</div>}
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{title}</p>
      <p className="amount text-lg">{value}</p>
      {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      {flag && (
        <div className={cn(
          "mt-2 h-1 rounded-full w-16",
          flag === "amber" && "bg-amber",
          flag === "rust" && "bg-rust",
          flag === "green" && "bg-emerald-500",
        )} />
      )}
    </Card>
  )
}
