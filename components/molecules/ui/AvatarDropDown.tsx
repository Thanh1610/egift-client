"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useUserStore } from "@/store/useUserStore"
import { ROUTES } from "@/lib/constants/routes"
import toast from "react-hot-toast"

interface AvatarDropDownProps {
  avatarUrl?: string | null
  fallback?: string
  className?: string
}

const DEFAULT_AVATAR = "/image/default_avatar.jpg"

function AvatarDropDown({
  avatarUrl,
  fallback = "U",
  className,
}: AvatarDropDownProps) {
  const router = useRouter()
  const { clearUser, profile } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const imageSrc = avatarUrl || DEFAULT_AVATAR

  useEffect(() => {
    // Use setTimeout to avoid setState in effect
    setTimeout(() => {
      setMounted(true)
    }, 0)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLogout = async () => {
    // Clear state ngay lập tức để UI phản hồi nhanh
    clearUser()
    
    // Gọi signOut không đợi (fire and forget)
    const supabase = createClient()
    supabase.auth.signOut().catch((error) => {
      console.error("SignOut error:", error)
    })
    
    toast.success("Đăng xuất thành công!")
    // Redirect ngay không đợi
    window.location.replace(ROUTES.AUTH.LOGIN)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild suppressHydrationWarning>
        <button className="cursor-pointer outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar className={className}>
            <AvatarImage src={imageSrc} alt="User avatar" />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-10000" suppressHydrationWarning>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || "User"}
            </p>
            {profile?.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Hồ sơ</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropDown