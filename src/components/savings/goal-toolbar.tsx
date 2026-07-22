"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2 } from "lucide-react"

interface GoalToolbarProps {
  goal: {
    id: number
    name: string
    targetAmount: string
    currency: string
    targetDate: string | null
  }
}

export function GoalToolbar({ goal }: GoalToolbarProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(goal.name)
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount)
  const [currency, setCurrency] = useState(goal.currency)
  const [targetDate, setTargetDate] = useState(goal.targetDate || "")
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/savings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goal.id, name, targetAmount, currency, targetDate: targetDate || null }),
      })
      if (res.ok) {
        setEditOpen(false)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/savings?id=${goal.id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/savings")
      }
    } finally {
      setLoading(false)
      setDeleteConfirm(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline"><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <Label htmlFor="edit-name">Goal name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label htmlFor="edit-amount">Target amount</Label>
                <Input id="edit-amount" type="number" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="edit-currency">Currency</Label>
                <select
                  id="edit-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-date">Target date (optional)</Label>
              <Input id="edit-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {deleteConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Delete?</span>
          <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "..." : "Yes"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(false)}>
            No
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(true)}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      )}
    </div>
  )
}
