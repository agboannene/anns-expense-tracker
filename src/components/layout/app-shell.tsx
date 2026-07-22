"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"

const authRoutes = ["/sign-in", "/sign-up", "/reset-password"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = authRoutes.some(route => pathname.startsWith(route))

  if (isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
