export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { savingsGoals, savingsContributions } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ContributeForm } from "@/components/savings/contribute-form"

export default async function SavingsGoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const goalId = Number(id)

  const [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.id, goalId))
  if (!goal) notFound()

  const contributions = await db
    .select()
    .from(savingsContributions)
    .where(eq(savingsContributions.goalId, goalId))
    .orderBy(sql`${savingsContributions.date} desc`)

  const totalContributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0)
  const progress = Math.min(100, (totalContributions / Number(goal.targetAmount)) * 100)

  const grouped = contributions.reduce<Record<string, typeof contributions>>((acc, c) => {
    const key = c.currency
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <Link href="/savings" className="text-sm text-amber hover:underline">&larr; Back to Savings</Link>

      <div>
        <h1 className="text-xl font-bold">{goal.name}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Target: {Number(goal.targetAmount).toLocaleString()} {goal.currency}
          {goal.targetDate && ` by ${new Date(goal.targetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="amount">{Number(totalContributions).toLocaleString()} {goal.currency}</span>
          <span className="text-zinc-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Contribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributeForm goalId={goal.id} onSuccess={() => {}} />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">Contribution History</h2>
        {contributions.length === 0 ? (
          <p className="text-sm text-zinc-400 italic">No contributions yet.</p>
        ) : (
          <div className="space-y-1">
            {Object.entries(grouped).map(([currency, entries]) => (
              <div key={currency}>
                <p className="text-xs font-medium text-zinc-400 mt-3 mb-1">{currency}</p>
                {entries.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="amount">{Number(c.amount).toLocaleString()}</span>
                      {c.isAutomaticTransfer && <span className="text-xs text-amber">Auto</span>}
                    </div>
                    <span className="text-zinc-400 text-xs">
                      {new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
