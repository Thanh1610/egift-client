import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants/routes"

interface SignupCredentials {
  name: string
  email: string
  password: string
}

export function useAuthSignup() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const supabase = createClient()
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
          },
        },
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }
    },
    onSuccess: () => {
      toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.")
      router.push(ROUTES.AUTH.LOGIN)
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    },
  })

  return {
    signup: mutation.mutate,
    signupAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
    isError: mutation.isError,
  }
}

