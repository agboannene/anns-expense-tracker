import { db } from "@/lib/db"
import { recurringItems, historyEntries } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { id, nextDueDate } = body

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

  await db.update(recurringItems)
    .set({ nextDueDate: nextDueDate, status: "upcoming" })
    .where(eq(recurringItems.id, id))

  return NextResponse.json({ success: true })
}
