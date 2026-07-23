import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    const tables = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position
    `)
    return NextResponse.json({ tables })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
