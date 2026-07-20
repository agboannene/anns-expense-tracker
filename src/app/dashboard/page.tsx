export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { savingsGoals, savingsContributions, recurringItems, pendingItems, dailySpendEntries, incomeEntries } from "@/lib/db/schema"
import { eq, and, gte, lte, sql } from "drizzle-orm"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { IncomeForm } from "@/components/dashboard/income-form"
import { PiggyBank, Clock, Receipt, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const end = now.toISOString().split("T")[0]
  return { start, end }
}

function formatCurrency(amount: string, currency: string) {
  return `${Number(amount).toLocaleString()} ${currency}`
}

export default async function DashboardPage() {
  const userId = "1"
  const { start, end } = getMonthRange()

  const goals = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId))

  const goalIds = goals.map(g => g.id)
  const totalsByGoal = goalIds.length > 0
    ? await db
        .select({
          goalId: savingsContributions.goalId,
          total: sql<string>`sum(${savingsContributions.amount})`,
        })
        .from(savingsContributions)
        .where(sql`${savingsContributions.goalId} = any(${goalIds})`)
        .groupBy(savingsContributions.goalId)
    : []

  const totalSaved = totalsByGoal.reduce((sum, g) => sum + Number(g.total), 0)
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount), 0)

  const monthlySpend = await db
    .select({ total: sql<string>`coalesce(sum(${dailySpendEntries.amount}), '0')` })
    .from(dailySpendEntries)
    .where(and(
      eq(dailySpendEntries.userId, userId),
      gte(dailySpendEntries.date, start),
      lte(dailySpendEntries.date, end),
    ))

  const monthlyIncome = await db
    .select({ total: sql<string>`coalesce(sum(${incomeEntries.amount}), '0')` })
    .from(incomeEntries)
    .where(and(
      eq(incomeEntries.userId, userId),
      gte(incomeEntries.date, start),
      lte(incomeEntries.date, end),
    ))

  const upcomingRecurring = await db
    .select()
    .from(recurringItems)
    .where(and(eq(recurringItems.userId, userId), sql`${recurringItems.status} != 'paid'`))
    .orderBy(recurringItems.nextDueDate)
    .limit(5)

  const openPending = await db
    .select()
    .from(pendingItems)
    .where(and(eq(pendingItems.userId, userId), sql`${pendingItems.status} != 'paid'`))
    .orderBy(pendingItems.status)

  const incomeList = await db
    .select()
    .from(incomeEntries)
    .where(eq(incomeEntries.userId, userId))
    .orderBy(sql`${incomeEntries.date} desc`)
    .limit(5)

  const savingsSummary = goals.length > 0
    ? `${formatCurrency(String(totalSaved), goals[0]?.currency || "NGN")} of ${formatCurrency(String(totalTarget), goals[0]?.currency || "NGN")}`
    : "No goals yet"

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          title="Savings"
          value={savingsSummary}
          subtitle={`${goals.length} goal${goals.length !== 1 ? "s" : ""}`}
          icon={<PiggyBank className="h-5 w-5" />}
        />
        <SummaryCard
          title="Income this month"
          value={formatCurrency(monthlyIncome[0]?.total || "0", "NGN")}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <SummaryCard
          title="Monthly spend"
          value={formatCurrency(monthlySpend[0]?.total || "0", "NGN")}
          icon={<Receipt className="h-5 w-5" />}
        />
        <SummaryCard
          title="Open pending"
          value={String(openPending.length)}
          subtitle={`${openPending.filter(i => i.status === "overdue").length} overdue`}
          flag={openPending.some(i => i.status === "overdue") ? "rust" : "amber"}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingRecurring.length === 0 ? (
              <p className="text-sm text-zinc-400">No upcoming bills.</p>
            ) : (
              <div className="space-y-2">
                {upcomingRecurring.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge variant={item.status === "overdue" ? "rust" : item.status === "due soon" ? "amber" : "default"}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="amount text-sm">{Number(item.amount).toLocaleString()} {item.currency}</p>
                      <p className="text-xs text-zinc-400">Due {new Date(item.nextDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Pending</CardTitle>
          </CardHeader>
          <CardContent>
            {openPending.length === 0 ? (
              <p className="text-sm text-zinc-400">Nothing pending right now.</p>
            ) : (
              <div className="space-y-2">
                {openPending.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.description}</span>
                      <Badge variant={item.status === "overdue" ? "rust" : "amber"}>{item.status}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="amount text-sm">{Number(item.amount).toLocaleString()} {item.currency}</p>
                      <p className="text-xs text-zinc-400">{item.counterpart}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">+ Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Income</DialogTitle>
              </DialogHeader>
              <IncomeForm onSuccess={() => {}} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {incomeList.length === 0 ? (
            <p className="text-sm text-zinc-400">No income logged yet this period.</p>
          ) : (
            <div className="space-y-2">
              {incomeList.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-sm font-medium">{item.source}</p>
                    <p className="text-xs text-zinc-400">{new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                  </div>
                  <p className="amount text-sm">{Number(item.amount).toLocaleString()} {item.currency}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
