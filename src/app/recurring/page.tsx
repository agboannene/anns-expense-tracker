"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"

interface RecurringItem {
  id: number
  name: string
  amount: string
  currency: string
  frequency: string
  nextDueDate: string
  status: string
}

interface HistoryEntry {
  id: number
  description: string
  amount: string
  currency: string
  dateSettled: string
  sourceType: string
}

const statusConfig: Record<string, { variant: "amber" | "rust" | "default" | "green"; label: string }> = {
  upcoming: { variant: "default", label: "Upcoming" },
  "due soon": { variant: "amber", label: "Due soon" },
  overdue: { variant: "rust", label: "Overdue" },
  paid: { variant: "green", label: "Paid" },
}

function getNextDueDate(frequency: string, currentDate: string): string {
  const d = new Date(currentDate)
  switch (frequency) {
    case "weekly": d.setDate(d.getDate() + 7); break
    case "monthly": d.setMonth(d.getMonth() + 1); break
    case "yearly": d.setFullYear(d.getFullYear() + 1); break
    default: d.setMonth(d.getMonth() + 1)
  }
  return d.toISOString().split("T")[0]
}

export default function RecurringPage() {
  const [items, setItems] = useState<RecurringItem[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [fetching, setFetching] = useState(true)
  const [tab, setTab] = useState<"active" | "history">("active")

  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("NGN")
  const [frequency, setFrequency] = useState("monthly")
  const [nextDueDate, setNextDueDate] = useState("")
  const [loading, setLoading] = useState(false)

  const [markPaidId, setMarkPaidId] = useState<number | null>(null)
  const [customDate, setCustomDate] = useState("")
  const [markingPaid, setMarkingPaid] = useState(false)

  async function loadData() {
    try {
      const [itemsRes, histRes] = await Promise.all([
        fetch("/api/recurring"),
        fetch("/api/recurring/history"),
      ])
      if (itemsRes.ok) setItems(await itemsRes.json())
      if (histRes.ok) setHistory(await histRes.json())
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount, currency, frequency, nextDueDate }),
      })
      if (res.ok) {
        setName(""); setAmount(""); setNextDueDate(""); setShowAdd(false)
        loadData()
      }
    } finally {
      setLoading(false)
    }
  }

  function openMarkPaid(id: number, currentDueDate: string) {
    setMarkPaidId(id)
    const suggested = getNextDueDate(
      items.find(i => i.id === id)?.frequency || "monthly",
      currentDueDate
    )
    setCustomDate(suggested)
  }

  async function confirmMarkPaid() {
    if (!markPaidId) return
    setMarkingPaid(true)
    try {
      const res = await fetch("/api/recurring/paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: markPaidId, nextDueDate: customDate }),
      })
      if (res.ok) {
        setMarkPaidId(null)
        loadData()
      }
    } finally {
      setMarkingPaid(false)
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Recurring</h1>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>+ Add</Button>
      </div>

      {showAdd && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Netflix, Rent" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <div>
                  <Label>Currency</Label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Frequency</Label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="nextDueDate">Next Due Date</Label>
                  <Input id="nextDueDate" type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Recurring"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {fetching ? (
        <p className="text-sm text-zinc-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-400 italic py-8 text-center">
          Nothing recurring set up yet. Add a bill or subscription to get started.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant={tab === "active" ? "default" : "ghost"} onClick={() => setTab("active")}>Active</Button>
            <Button size="sm" variant={tab === "history" ? "default" : "ghost"} onClick={() => setTab("history")}>History</Button>
          </div>

          {tab === "active" && (
            <div className="space-y-2">
              {items.map((item) => {
                const config = statusConfig[item.status.toLowerCase()] || statusConfig.upcoming
                return (
                  <Card key={item.id}>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            <Badge variant={config.variant}>{config.label}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <span className="amount">{Number(item.amount).toLocaleString()} {item.currency}</span>
                            <span className="capitalize">{item.frequency}</span>
                            <span>Due: {new Date(item.nextDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                          </div>
                        </div>
                        {item.status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => openMarkPaid(item.id, item.nextDueDate)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Mark Paid
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-1">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-400 italic py-4 text-center">No payment history yet.</p>
              ) : (
                history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-1.5 text-sm">
                    <div>
                      <span className="font-medium">{entry.description}</span>
                      <span className="ml-2 amount">{Number(entry.amount).toLocaleString()} {entry.currency}</span>
                    </div>
                    <span className="text-zinc-400 text-xs">
                      {new Date(entry.dateSettled).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {markPaidId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Mark as Paid</h3>
                <p className="text-sm text-zinc-500 mt-1">Set the next due date:</p>
              </div>
              <div>
                <Label htmlFor="nextDue">Next Due Date</Label>
                <Input id="nextDue" type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={confirmMarkPaid} disabled={markingPaid || !customDate}>
                  {markingPaid ? "Saving..." : "Confirm"}
                </Button>
                <Button variant="outline" onClick={() => setMarkPaidId(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
