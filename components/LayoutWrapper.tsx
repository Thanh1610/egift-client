"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import Footer from "@/components/organisms/Footer"
import ScrollToTop from "@/components/organisms/ScrollToTop"

// Header dùng Radix navigation; tắt SSR để tránh hydration mismatch khi Radix tạo id khác nhau giữa server/client
const Header = dynamic(() => import("@/components/organisms/header"), { ssr: false })

interface LayoutWrapperProps {
  children: React.ReactNode
}

/**
 * LayoutWrapper - Ẩn header và footer ở các trang auth
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()

  // Các route auth - không hiển thị header và footer
  const isAuthRoute = pathname?.startsWith("/auth")

  return (
    <>
      {!isAuthRoute && <Header />}
      <main className={`bg-background text-foreground ${!isAuthRoute ? "mt-[100px]" : ""}`}>
        {children}
      </main>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <ScrollToTop />}
    </>
  )
}

