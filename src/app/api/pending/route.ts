import { db } from "@/lib/db"
import { pendingItems } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { description, amount, currency, counterpart } = body

  const [item] = await db.insert(pendingItems).values({
    userId: "1",
    description,
    amount,
    currency,
    counterpart,
  }).returning()

  return NextResponse.json(item)
}
