import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL
    const authSecret = process.env.BETTER_AUTH_SECRET
    const authUrl = process.env.BETTER_AUTH_URL

    const info = {
      hasDbUrl: !!dbUrl,
      dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + "..." : "MISSING",
      hasAuthSecret: !!authSecret,
      hasAuthUrl: !!authUrl,
      authUrl,
    }

    const { db } = await import("@/lib/db")
    const result = await db.execute(`SELECT 1 as ok`)

    return NextResponse.json({ ...info, dbConnected: true, result: result })
  } catch (err: unknown) {
    const error = err as Error
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        name: error.name,
      },
      { status: 500 }
    )
  }
}
