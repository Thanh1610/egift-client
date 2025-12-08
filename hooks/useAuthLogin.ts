import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import type { UserProfile } from "@/store/useUserStore"

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  error?: string
}

export function useAuthLogin() {
  const router = useRouter()
  const { setUser, setProfile } = useUserStore()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const supabase = createClient()
      
      // Sign in with email and password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (signInError) {
        throw new Error(signInError.message)
      }

      // Lưu user và profile vào Zustand store (không check role ở client)
      if (signInData.user) {
        // Fetch profile từ database
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", signInData.user.id)
          .single()

        // Lưu user và profile vào store
        setUser(signInData.user)
        if (profile) {
          setProfile(profile as UserProfile)
        }
      }

      return {
        success: true,
      }
    },
    onSuccess: () => {
      toast.success("Đăng nhập thành công!")
      router.push(ROUTES.HOME)
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    },
  })

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
    isError: mutation.isError,
  }
}

