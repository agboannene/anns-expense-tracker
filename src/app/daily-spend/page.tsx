export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { dailySpendEntries } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import dynamicImport from "next/dynamic"

const AddSpendForm = dynamicImport(() => import("@/components/daily-spend/add-spend-form").then(m => m.AddSpendForm), { ssr: false })

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
        <Card>
          <CardContent className="p-4">
            <p className="text-red-400 font-mono text-sm">Query Error: {queryError}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(totals).length === 0 ? (
            <p className="text-sm text-zinc-400">No spending yet.</p>
          ) : (
            Object.entries(totals).map(([currency, total]) => (
              <p key={currency} className="amount text-lg">
                {total.toLocaleString()} {currency}
              </p>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <AddSpendForm onSuccess={() => {}} />
        </CardContent>
      </Card>

      <Separator />

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
                <span className="text-xs text-zinc-400">
                  {new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
