"use client"

import dynamic from "next/dynamic"

const AddSpendForm = dynamic(() => import("./add-spend-form").then(m => m.AddSpendForm), { ssr: false })

export function AddSpendWrapper() {
  return <AddSpendForm onSuccess={() => {}} />
}
