import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants/routes"

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

      // Check user role in profile
      if (signInData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", signInData.user.id)
          .single()

        if (profileError || !profile) {
          // Sign out if profile doesn't exist
          await supabase.auth.signOut()
          throw new Error("Bạn không có quyền truy cập vào trang này.")
        }

        // Check if role is "master"
        if (profile.role !== "master") {
          // Sign out user if role is not master
          await supabase.auth.signOut()
          throw new Error("Bạn không có quyền truy cập vào trang này.")
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

