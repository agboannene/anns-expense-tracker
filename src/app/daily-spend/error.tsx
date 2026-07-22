"use client"

export default function DailySpendError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-2xl">
      <h1 className="text-xl font-bold mb-4">Daily Spend</h1>
      <div className="border border-red-300 rounded-lg p-6 bg-red-50">
        <p className="text-red-600 font-mono text-sm whitespace-pre-wrap">Error: {error.message}</p>
        <button onClick={reset} className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm">Try again</button>
      </div>
    </div>
  )
}
