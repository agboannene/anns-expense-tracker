"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const end = now.toISOString().split("T")[0]
  return { start, end }
}

export default function DailySpendPage() {
  const userId = "1"
  const { start, end } = getMonthRange()

  const [entries, setEntries] = useState<any[]>([])
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("NGN")
  const [note, setNote] = useState("")
  const [showNote, setShowNote] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  async function loadEntries() {
    try {
      const res = await fetch(`/api/daily-spend?userId=${userId}&start=${start}&end=${end}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data)
      }
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { loadEntries() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/daily-spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, note, date: new Date().toISOString().split("T")[0] }),
      })
      if (res.ok) {
        setAmount(""); setNote(""); setShowNote(false)
        loadEntries()
      }
    } finally {
      setLoading(false)
    }
  }

  const totals = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.currency] = (acc[e.currency] || 0) + Number(e.amount)
    return acc
  }, {})

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold">Daily Spend</h1>

      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <p className="text-sm text-zinc-400">Loading...</p>
          ) : Object.entries(totals).length === 0 ? (
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
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" placeholder="e.g. 2500" value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus />
              </div>
              <div className="w-24">
                <Label htmlFor="currency">Curr</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <Button type="submit" disabled={loading || !amount}>
                {loading ? "..." : "Log"}
              </Button>
            </div>
            <div>
              <button type="button" onClick={() => setShowNote(!showNote)} className="text-xs text-amber hover:underline">
                {showNote ? "Hide note" : "+ Add note"}
              </button>
              {showNote && (
                <Input
                  placeholder="e.g. transport, lunch"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">Entries</h2>
        {fetching ? (
          <p className="text-sm text-zinc-400 italic py-4 text-center">Loading...</p>
        ) : entries.length === 0 ? (
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
