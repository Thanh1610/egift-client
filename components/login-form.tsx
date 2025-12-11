"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthLogin } from "@/hooks/useAuthLogin"
import { useAuthOAuth } from "@/hooks/useAuthOAuth"
import { ROUTES } from "@/lib/constants/routes"

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const { login, isLoading: isLoginLoading } = useAuthLogin()
  const { loginWithOAuth, isLoading: isOAuthLoading } = useAuthOAuth()

  const isLoading = isLoginLoading || isOAuthLoading || isSubmitting

  // Check for error from URL params (e.g., from OAuth callback)
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      const errorMessage = decodeURIComponent(errorParam)
      toast.error(errorMessage)
      // Clean up URL by removing error param
      router.replace(ROUTES.AUTH.LOGIN, { scroll: false })
    }
  }, [searchParams, router])

  const onSubmit = async (data: LoginFormValues) => {
    login({ email: data.email, password: data.password })
  }

  const handleGoogleLogin = () => {
    loginWithOAuth("google")
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Đăng nhập vào tài khoản của bạn</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập email của bạn bên dưới để đăng nhập vào tài khoản
          </p>
        </div>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            aria-invalid={!!errors.email}
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
        <Field data-invalid={!!errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Field>
        {/* <FieldSeparator>Hoặc tiếp tục với</FieldSeparator> */}
        <Field>
          {/* <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập với Google
          </Button> */}
          <FieldDescription className="text-center">
            Bạn chưa có tài khoản?{" "}
            <a href={ROUTES.AUTH.SIGNUP} className="underline underline-offset-4">
              Đăng ký
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
