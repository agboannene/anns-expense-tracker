import { db } from "@/lib/db"
import { savingsContributions } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { goalId, amount, currency, date } = body

  const [contribution] = await db.insert(savingsContributions).values({
    goalId,
    userId: "1",
    amount,
    currency,
    date,
  }).returning()

  return NextResponse.json(contribution)
}
