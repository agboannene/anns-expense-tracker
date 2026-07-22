"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Pencil, Trash2 } from "lucide-react"

export default function SavingsGoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const goalId = Number(id)
  const router = useRouter()

  const [goal, setGoal] = useState<any>(null)
  const [contributions, setContributions] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currency, setCurrency] = useState("NGN")
  const [targetDate, setTargetDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const [cAmount, setCAmount] = useState("")
  const [cCurrency, setCCurrency] = useState("NGN")
  const [cLoading, setCLoading] = useState(false)

  async function loadData() {
    try {
      const res = await fetch(`/api/savings/goal?id=${goalId}`)
      if (res.ok) {
        const data = await res.json()
        setGoal(data.goal)
        setContributions(data.contributions)
        setName(data.goal.name)
        setTargetAmount(data.goal.targetAmount)
        setCurrency(data.goal.currency)
        setTargetDate(data.goal.targetDate || "")
      }
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { loadData() }, [goalId])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/savings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goalId, name, targetAmount, currency, targetDate: targetDate || null }),
      })
      if (res.ok) {
        setEditOpen(false)
        loadData()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/savings?id=${goalId}`, { method: "DELETE" })
      if (res.ok) router.push("/savings")
    } finally {
      setLoading(false)
      setDeleteConfirm(false)
    }
  }

  async function handleContribute(e: React.FormEvent) {
    e.preventDefault()
    setCLoading(true)
    try {
      const res = await fetch("/api/savings/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, amount: cAmount, currency: cCurrency, date: new Date().toISOString().split("T")[0] }),
      })
      if (res.ok) {
        setCAmount("")
        loadData()
      }
    } finally {
      setCLoading(false)
    }
  }

  if (fetching) return (
    <div className="flex-1 p-4 md:p-6 max-w-2xl">
      <Link href="/savings" className="text-sm text-amber hover:underline">&larr; Back to Savings</Link>
      <p className="text-sm text-zinc-400 mt-4">Loading...</p>
    </div>
  )

  if (!goal) return (
    <div className="flex-1 p-4 md:p-6 max-w-2xl">
      <Link href="/savings" className="text-sm text-amber hover:underline">&larr; Back to Savings</Link>
      <p className="text-sm text-zinc-400 mt-4">Goal not found.</p>
    </div>
  )

  const totalContributions = contributions.reduce((sum: number, c: any) => sum + Number(c.amount), 0)
  const progress = Math.min(100, (totalContributions / Number(goal.targetAmount)) * 100)

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-2xl">
      <Link href="/savings" className="text-sm text-amber hover:underline">&larr; Back to Savings</Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{goal.name}</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Target: {Number(goal.targetAmount).toLocaleString()} {goal.currency}
            {goal.targetDate && ` by ${new Date(goal.targetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditOpen(!editOpen)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          {deleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Delete?</span>
              <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? "..." : "Yes"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(false)}>No</Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
        </div>
      </div>

      {editOpen && (
        <Card>
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      )}

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
          <form onSubmit={handleContribute} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label htmlFor="c-amount">Amount</Label>
                <Input id="c-amount" type="number" step="0.01" value={cAmount} onChange={(e) => setCAmount(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="c-currency">Currency</Label>
                <select
                  id="c-currency"
                  value={cCurrency}
                  onChange={(e) => setCCurrency(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={cLoading}>
              {cLoading ? "Adding..." : "Add Contribution"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">Contribution History</h2>
        {contributions.length === 0 ? (
          <p className="text-sm text-zinc-400 italic">No contributions yet.</p>
        ) : (
          <div className="space-y-1">
            {contributions.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="amount">{Number(c.amount).toLocaleString()} {c.currency}</span>
                  {c.isAutomaticTransfer && <span className="text-xs text-amber">Auto</span>}
                </div>
                <span className="text-zinc-400 text-xs">
                  {new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
