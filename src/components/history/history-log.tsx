import { Card, CardContent } from "@/components/ui/card"

interface HistoryEntry {
  id: number
  sourceType: string
  description: string
  amount: string
  currency: string
  dateSettled: string
}

interface HistoryLogProps {
  entries: HistoryEntry[]
}

export function HistoryLog({ entries }: HistoryLogProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-zinc-400 italic py-4 text-center">
        Settled items will show up here once you mark something as paid.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <Card key={entry.id} className="opacity-70">
          <CardContent className="py-3">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="capitalize text-xs text-zinc-400">{entry.sourceType}</span>
                <p className="font-medium">{entry.description}</p>
              </div>
              <div className="text-right">
                <p className="amount">{Number(entry.amount).toLocaleString()} {entry.currency}</p>
                <p className="text-xs text-zinc-400">
                  {new Date(entry.dateSettled).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
