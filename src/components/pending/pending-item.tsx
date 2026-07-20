"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface PendingItemProps {
  id: number
  description: string
  amount: string
  currency: string
  counterpart: string
  status: string
  onMarkPaid: (id: number) => void
}

const statusConfig: Record<string, { variant: "amber" | "rust" | "default" | "green"; label: string }> = {
  pending: { variant: "amber", label: "Pending" },
  overdue: { variant: "rust", label: "Overdue" },
  paid: { variant: "green", label: "Paid" },
}

export function PendingItem({ id, description, amount, currency, counterpart, status, onMarkPaid }: PendingItemProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{description}</h3>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
            <div className="text-sm text-zinc-500">
              <span className="amount">{Number(amount).toLocaleString()} {currency}</span>
              <span className="mx-2">&middot;</span>
              <span>{counterpart}</span>
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
