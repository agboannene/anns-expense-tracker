import { db } from "@/lib/db"
import { savingsGoals } from "@/lib/db/schema"
import { NextResponse } from "next/server"

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
