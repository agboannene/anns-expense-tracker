import { db } from "@/lib/db"
import { recurringItems } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, amount, currency, frequency, nextDueDate } = body

  const [item] = await db.insert(recurringItems).values({
    userId: "1",
    name,
    amount,
    currency,
    frequency,
    nextDueDate,
  }).returning()

  return NextResponse.json(item)
}
