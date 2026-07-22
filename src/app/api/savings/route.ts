import { db } from "@/lib/db"
import { savingsGoals, savingsContributions } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { eq, sql } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.id, Number(id)))
    if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const contributions = await db
      .select()
      .from(savingsContributions)
      .where(eq(savingsContributions.goalId, Number(id)))
      .orderBy(sql`${savingsContributions.date} desc`)
    return NextResponse.json({ goal, contributions })
  }

  const goals = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, "1"))
  return NextResponse.json(goals)
}

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
