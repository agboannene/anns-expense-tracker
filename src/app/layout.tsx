import type { Metadata } from "next"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"

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
        <Sidebar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
