"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddSpendFormProps {
  onSuccess: () => void
}

export function AddSpendForm({ onSuccess }: AddSpendFormProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("NGN")
  const [note, setNote] = useState("")
  const [showNote, setShowNote] = useState(false)
  const [loading, setLoading] = useState(false)

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
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
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
  )
}
