import { db } from "@/lib/db"
import { dailySpendEntries } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { amount, currency, note, date } = body

  const [entry] = await db.insert(dailySpendEntries).values({
    userId: "1",
    amount,
    currency,
    note: note || null,
    date,
  }).returning()

  return NextResponse.json(entry)
}
