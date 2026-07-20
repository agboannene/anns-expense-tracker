import { db } from "@/lib/db"
import { recurringItems, historyEntries } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

function rollDate(dateStr: string, frequency: string): string {
  const d = new Date(dateStr)
  switch (frequency) {
    case "weekly": d.setDate(d.getDate() + 7); break
    case "monthly": d.setMonth(d.getMonth() + 1); break
    case "yearly": d.setFullYear(d.getFullYear() + 1); break
    default: d.setMonth(d.getMonth() + 1)
  }
  return d.toISOString().split("T")[0]
}

export async function POST(req: Request) {
  const body = await req.json()
  const { id } = body

  const [item] = await db.select().from(recurringItems).where(eq(recurringItems.id, id))
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.insert(historyEntries).values({
    userId: item.userId,
    sourceType: "recurring",
    sourceId: item.id,
    description: item.name,
    amount: item.amount,
    currency: item.currency,
    dateSettled: new Date().toISOString().split("T")[0],
  })

  const nextDue = rollDate(item.nextDueDate, item.frequency)
  await db.update(recurringItems)
    .set({ nextDueDate: nextDue, status: "upcoming" })
    .where(eq(recurringItems.id, id))

  return NextResponse.json({ success: true })
}
