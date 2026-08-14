"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { updatePassword } from "@/actions/auth/reset-password"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const res = await updatePassword(formData)

    if (res.success) {
      toast.success(res.message, { position: "top-right" })
      router.push("/admin-login")
    } else {
      setError(res.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter a new password for your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input name="password" id="password" type="password" required />
        </Field>
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="confirm_password">Confirm Password</FieldLabel>
          <Input
            name="confirm_password"
            id="confirm_password"
            type="password"
            aria-invalid={!!error}
            required
          />
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Update Password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
