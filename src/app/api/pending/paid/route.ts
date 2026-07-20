import { db } from "@/lib/db"
import { pendingItems, historyEntries } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { id } = body

  const [item] = await db.select().from(pendingItems).where(eq(pendingItems.id, id))
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.insert(historyEntries).values({
    userId: item.userId,
    sourceType: "pending",
    sourceId: item.id,
    description: `${item.description} (${item.counterpart})`,
    amount: item.amount,
    currency: item.currency,
    dateSettled: new Date().toISOString().split("T")[0],
  })

  await db.update(pendingItems)
    .set({ status: "paid" })
    .where(eq(pendingItems.id, id))

  return NextResponse.json({ success: true })
}
