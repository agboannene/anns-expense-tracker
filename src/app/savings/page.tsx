export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { savingsGoals, savingsContributions } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { GoalCard } from "@/components/savings/goal-card"
import { AddGoalDialog } from "./add-goal-dialog"

export default async function SavingsPage() {
  const userId = "1"

  const goals = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId))

  const goalIds = goals.map(g => g.id)
  const totals = goalIds.length > 0
    ? await db
        .select({
          goalId: savingsContributions.goalId,
          total: sql<string>`coalesce(sum(${savingsContributions.amount}), '0')`,
        })
        .from(savingsContributions)
        .where(sql`${savingsContributions.goalId} = any(${goalIds})`)
        .groupBy(savingsContributions.goalId)
    : []

  const totalMap = Object.fromEntries(totals.map(t => [t.goalId, t.total]))

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Savings</h1>
        <AddGoalDialog />
      </div>

      {goals.length === 0 ? (
        <p className="text-sm text-zinc-400 italic py-8 text-center">
          No savings goals yet. Add one to start tracking progress.
        </p>
      ) : (
        <div className="grid gap-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.name}
              targetAmount={goal.targetAmount}
              currency={goal.currency}
              currentAmount={totalMap[goal.id] || "0"}
              targetDate={goal.targetDate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
