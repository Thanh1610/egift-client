"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { useAuthSignup } from "@/hooks/useAuthSignup"
import { useAuthOAuth } from "@/hooks/useAuthOAuth"
import { ROUTES } from "@/lib/constants/routes"
import { Spinner } from "@/components/ui/spinner"

const signupSchema = z
  .object({
    name: z.string().min(1, "Họ và tên đầy đủ là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const { signup, isLoading: isSignupLoading } = useAuthSignup()
  const { loginWithOAuth, isLoading: isOAuthLoading } = useAuthOAuth()

  const isLoading = isSignupLoading || isOAuthLoading || isSubmitting

  const onSubmit = async (data: SignupFormValues) => {
    signup({ name: data.name, email: data.email, password: data.password })
  }

  const handleGitHubSignup = () => {
    loginWithOAuth("github")
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)} 
      suppressHydrationWarning
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Tạo tài khoản của bạn</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Hãy điền vào biểu mẫu bên dưới để tạo tài khoản của bạn.
          </p>
        </div>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Nguyễn Văn A"
            aria-invalid={!!errors.name}
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && <FieldError errors={[errors.name]} />}
        </Field>
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
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <Input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            aria-invalid={!!errors.confirmPassword}
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : null}
            Tạo tài khoản
          </Button>
        </Field>
        <FieldSeparator>Hoặc tiếp tục với</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={handleGitHubSignup} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Đăng ký với GitHub
          </Button>
          <FieldDescription className="px-6 text-center">
            Bạn đã có tài khoản? <a href={ROUTES.AUTH.LOGIN}>Đăng nhập</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
