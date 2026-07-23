"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth-client"


export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [forgotOpen, setForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMsg, setResetMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error?.message || data.message || "Invalid credentials")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setResetMsg("")
    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, redirectTo: "/reset-password" }),
      })
      if (res.ok) {
        setResetMsg("Check your email for a reset link.")
      } else {
        const data = await res.json()
        setResetMsg(data.message || "Could not send reset email")
      }
    } catch {
      setResetMsg("Something went wrong")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        {!forgotOpen ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ann@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => { setForgotOpen(true); setResetEmail(email) }}
                    className="text-xs text-amber hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-rust">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <p className="text-center text-sm text-zinc-500 mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-amber hover:underline">Sign up</Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="font-semibold">Reset Password</h2>
              <p className="text-sm text-zinc-500 mt-1">Enter your email and we&apos;ll send a reset link.</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="ann@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              {resetMsg && <p className="text-sm text-amber">{resetMsg}</p>}
              <Button type="submit" className="w-full" disabled={resetLoading}>
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <button
                type="button"
                onClick={() => { setForgotOpen(false); setResetMsg("") }}
                className="text-sm text-zinc-500 hover:underline w-full text-center"
              >
                Back to sign in
              </button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
