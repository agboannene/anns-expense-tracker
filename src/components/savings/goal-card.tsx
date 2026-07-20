import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface GoalCardProps {
  id: number
  name: string
  targetAmount: string
  currency: string
  currentAmount: string
  targetDate: string | null
}

export function GoalCard({ id, name, targetAmount, currency, currentAmount, targetDate }: GoalCardProps) {
  const progress = Math.min(100, (Number(currentAmount) / Number(targetAmount)) * 100)

  return (
    <Link href={`/savings/${id}`}>
      <Card className="hover:border-amber/30 transition-colors cursor-pointer">
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{name}</h3>
            <Badge variant="amber">{Math.round(progress)}%</Badge>
          </div>
          <Progress value={progress} className="mb-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">
              <span className="amount">{Number(currentAmount).toLocaleString()}</span> /{" "}
              <span className="amount">{Number(targetAmount).toLocaleString()}</span>
            </span>
            <span className="font-medium text-xs text-zinc-400">{currency}</span>
          </div>
          {targetDate && (
            <p className="text-xs text-zinc-400 mt-1">Target: {new Date(targetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
