"use client"

import { useRouter } from "next/navigation"
import { RecurringItem } from "@/components/recurring/recurring-item"

interface RecurringItemData {
  id: number
  name: string
  amount: string
  currency: string
  frequency: string
  nextDueDate: string
  status: string
}

export function RecurringList({ items }: { items: RecurringItemData[] }) {
  const router = useRouter()

  async function markPaid(id: number) {
    await fetch("/api/recurring/paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <RecurringItem key={item.id} {...item} onMarkPaid={markPaid} />
      ))}
    </div>
  )
}
