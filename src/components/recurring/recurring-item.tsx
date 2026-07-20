"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface RecurringItemProps {
  id: number
  name: string
  amount: string
  currency: string
  frequency: string
  nextDueDate: string
  status: string
  onMarkPaid: (id: number) => void
}

const statusConfig: Record<string, { variant: "amber" | "rust" | "default" | "green"; label: string }> = {
  upcoming: { variant: "default", label: "Upcoming" },
  "due soon": { variant: "amber", label: "Due soon" },
  overdue: { variant: "rust", label: "Overdue" },
  paid: { variant: "green", label: "Paid" },
}

export function RecurringItem({ id, name, amount, currency, frequency, nextDueDate, status, onMarkPaid }: RecurringItemProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.upcoming

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{name}</h3>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <span className="amount">{Number(amount).toLocaleString()} {currency}</span>
              <span className="capitalize">{frequency}</span>
              <span>Due: {new Date(nextDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            </div>
          </div>
          {status !== "paid" && (
            <Button size="sm" variant="outline" onClick={() => onMarkPaid(id)}>
              <CheckCircle className="h-4 w-4 mr-1" /> Mark Paid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
