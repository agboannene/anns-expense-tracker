"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
          <Label>Curr</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
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
