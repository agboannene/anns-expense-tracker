"use client"

import { useRouter } from "next/navigation"
import { PendingItem } from "@/components/pending/pending-item"

interface PendingItemData {
  id: number
  description: string
  amount: string
  currency: string
  counterpart: string
  status: string
}

export function PendingList({ items }: { items: PendingItemData[] }) {
  const router = useRouter()

  async function markPaid(id: number) {
    await fetch("/api/pending/paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <PendingItem key={item.id} {...item} onMarkPaid={markPaid} />
      ))}
    </div>
  )
}
