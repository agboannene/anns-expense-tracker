import type { Metadata } from "next"
import "./globals.css"
import { AppShell } from "@/components/layout/app-shell"

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal expense tracker for savings, recurring bills, pending items, and daily spend.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-primary-dark">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
