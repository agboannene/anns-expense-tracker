import { db } from "@/lib/db"
import { historyEntries } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const entries = await db
    .select()
    .from(historyEntries)
    .where(sql`${historyEntries.userId} = '1' AND ${historyEntries.sourceType} = 'recurring'`)
    .orderBy(sql`${historyEntries.dateSettled} desc`)
  return NextResponse.json(entries)
}
