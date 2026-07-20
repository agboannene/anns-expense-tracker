import { db } from "@/lib/db"
import { incomeEntries } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { amount, currency, source, date } = body

  const [entry] = await db.insert(incomeEntries).values({
    userId: "1",
    amount,
    currency,
    source,
    date,
  }).returning()

  return NextResponse.json(entry)
}
