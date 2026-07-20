export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { recurringItems, historyEntries } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { RecurringList } from "./recurring-list"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AddRecurringForm } from "@/components/recurring/add-recurring-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoryLog } from "@/components/history/history-log"

export default async function RecurringPage() {
  const userId = "1"

  const items = await db
    .select()
    .from(recurringItems)
    .where(eq(recurringItems.userId, userId))
    .orderBy(recurringItems.nextDueDate)

  const history = await db
    .select()
    .from(historyEntries)
    .where(sql`${historyEntries.userId} = ${userId} AND ${historyEntries.sourceType} = 'recurring'`)
    .orderBy(sql`${historyEntries.dateSettled} desc`)

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Recurring</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">+ Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Recurring</DialogTitle>
            </DialogHeader>
            <AddRecurringForm onSuccess={() => {}} />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-400 italic py-8 text-center">
          Nothing recurring set up yet. Add a bill or subscription to get started.
        </p>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <RecurringList items={items} />
          </TabsContent>
          <TabsContent value="history">
            <HistoryLog entries={history} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
