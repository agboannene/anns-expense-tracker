"use client"

import { useParams } from "next/navigation"

export default function SavingsGoalPage() {
  const params = useParams()
  return <div className="flex-1 p-4 md:p-6"><h1 className="text-xl font-bold">Savings Goal #{params.id}</h1></div>
}
