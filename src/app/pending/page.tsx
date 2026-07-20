export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { pendingItems, historyEntries } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { PendingList } from "./pending-list"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AddPendingForm } from "@/components/pending/add-pending-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoryLog } from "@/components/history/history-log"

export default async function PendingPage() {
  const userId = "1"

  const items = await db
    .select()
    .from(pendingItems)
    .where(eq(pendingItems.userId, userId))
    .orderBy(sql`CASE WHEN ${pendingItems.status} = 'overdue' THEN 0 WHEN ${pendingItems.status} = 'pending' THEN 1 ELSE 2 END`)

  const history = await db
    .select()
    .from(historyEntries)
    .where(sql`${historyEntries.userId} = ${userId} AND ${historyEntries.sourceType} = 'pending'`)
    .orderBy(sql`${historyEntries.dateSettled} desc`)

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Pending</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">+ Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Pending</DialogTitle>
            </DialogHeader>
            <AddPendingForm onSuccess={() => {}} />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-400 italic py-8 text-center">
          Nothing pending right now.
        </p>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <PendingList items={items} />
          </TabsContent>
          <TabsContent value="history">
            <HistoryLog entries={history} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
