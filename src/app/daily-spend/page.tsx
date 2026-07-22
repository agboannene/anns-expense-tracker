export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { dailySpendEntries } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const end = now.toISOString().split("T")[0]
  return { start, end }
}

export default async function DailySpendPage() {
  const userId = "1"
  const { start, end } = getMonthRange()

  let entries: any[] = []
  let queryError: string | null = null

  try {
    entries = await db
      .select()
      .from(dailySpendEntries)
      .where(sql`${dailySpendEntries.userId} = ${userId} AND ${dailySpendEntries.date} >= ${start} AND ${dailySpendEntries.date} <= ${end}`)
      .orderBy(sql`${dailySpendEntries.date} desc`)
  } catch (err: any) {
    queryError = err.message
  }

  const totals = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.currency] = (acc[e.currency] || 0) + Number(e.amount)
    return acc
  }, {})

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold">Daily Spend</h1>

      {queryError && (
        <div className="border border-red-300 rounded-lg p-4">
          <p className="text-red-400 font-mono text-sm">Query Error: {queryError}</p>
        </div>
      )}

      <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
        <h2 className="font-semibold mb-2">This Month</h2>
        {Object.entries(totals).length === 0 ? (
          <p className="text-sm text-zinc-400">No spending yet.</p>
        ) : (
          Object.entries(totals).map(([currency, total]) => (
            <p key={currency} className="amount text-lg">
              {total.toLocaleString()} {currency}
            </p>
          ))
        )}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
        <h2 className="font-semibold mb-2">Log Spending</h2>
        <p className="text-sm text-zinc-400">Form coming soon</p>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-700" />

      <div>
        <h2 className="font-semibold mb-3">Entries</h2>
        {entries.length === 0 ? (
          <p className="text-sm text-zinc-400 italic py-4 text-center">
            No spending logged yet this month.
          </p>
        ) : (
          <div className="space-y-1">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="amount">{Number(entry.amount).toLocaleString()} {entry.currency}</span>
                  {entry.note && <span className="text-zinc-400 text-xs">{entry.note}</span>}
                </div>
                <span className="text-xs text-zinc-400">{entry.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
