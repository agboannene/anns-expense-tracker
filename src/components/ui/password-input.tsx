"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function PasswordInput({ label, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      {label && <label htmlFor={props.id} className="text-sm font-medium leading-none mb-1.5 block">{label}</label>}
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          className={className}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
