import { db } from "@/lib/db"
import { dailySpendEntries } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { sql, eq, and } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || "1"
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  const conditions = [eq(dailySpendEntries.userId, userId)]
  if (start) conditions.push(sql`${dailySpendEntries.date} >= ${start}`)
  if (end) conditions.push(sql`${dailySpendEntries.date} <= ${end}`)

  const entries = await db
    .select()
    .from(dailySpendEntries)
    .where(and(...conditions))
    .orderBy(sql`${dailySpendEntries.date} desc`)

  return NextResponse.json(entries)
}

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
