"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { forgotPassword } from "@/actions/auth/forgot-password"

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setResult(null)
    const res = await forgotPassword(formData)
    setResult(res)
    setIsSubmitting(false)
  }

  if (result?.success) {
    return (
      <div className={cn("flex flex-col items-center gap-4 text-center", className)} {...props}>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-balance text-muted-foreground">{result.message}</p>
        <a href="/admin-login" className="text-sm underline underline-offset-4">
          Back to login
        </a>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className={cn("flex flex-col gap-6", className)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Password Reset</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to reset your password
          </p>
        </div>
        <Field data-invalid={result?.success === false}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="hello@gmail.com"
            aria-invalid={result?.success === false}
            required
          />
          {result?.success === false && <FieldError>{result.message}</FieldError>}
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Reset Password"}
          </Button>
        </Field>
        <div className="text-center text-sm">
          <a href="/admin-login" className="underline underline-offset-4">
            Back to login
          </a>
        </div>
      </FieldGroup>
    </form>
  )
}
