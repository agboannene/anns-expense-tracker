import { db } from "@/lib/db"
import { savingsGoals } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, targetAmount, currency, targetDate } = body

  const [goal] = await db.insert(savingsGoals).values({
    userId: "1",
    name,
    targetAmount,
    currency,
    targetDate: targetDate || null,
  }).returning()

  return NextResponse.json(goal)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, name, targetAmount, currency, targetDate } = body

  if (!id) return NextResponse.json({ error: "Goal ID required" }, { status: 400 })

  const [goal] = await db
    .update(savingsGoals)
    .set({
      ...(name !== undefined && { name }),
      ...(targetAmount !== undefined && { targetAmount }),
      ...(currency !== undefined && { currency }),
      ...(targetDate !== undefined && { targetDate: targetDate || null }),
    })
    .where(eq(savingsGoals.id, id))
    .returning()

  return NextResponse.json(goal)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ error: "Goal ID required" }, { status: 400 })

  await db.delete(savingsGoals).where(eq(savingsGoals.id, Number(id)))

  return NextResponse.json({ ok: true })
}
