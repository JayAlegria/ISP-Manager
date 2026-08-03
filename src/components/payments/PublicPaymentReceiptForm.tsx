"use client"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import {
    PaymentReceiptFormInput,
    PaymentReceiptFormOutput,
    paymentReceiptFormSchema,
} from "@/schemas/paymentReceiptSchema"
import { paymentMethodLabels } from "@/types/payments"

const paymentMethodOptions = Object.entries(paymentMethodLabels).map(([value, label]) => ({ label, value }))

const defaultValues: Partial<PaymentReceiptFormInput> = {
    account_number: "",
    billing_period: "",
    payment_method: "",
}

function formatBillingPeriod(billingPeriod: string): string {
    const date = new Date(`${billingPeriod}-01`)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

type TAccountCheck = {
    value: string
    status: "checking" | "valid" | "invalid"
    name: string | null
}

export function PublicPaymentReceiptForm() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [accountCheck, setAccountCheck] = useState<TAccountCheck | null>(null)
    const [billingPeriods, setBillingPeriods] = useState<string[]>([])
    const [billingPeriodOpen, setBillingPeriodOpen] = useState(false)
    const form = useForm<PaymentReceiptFormInput, unknown, PaymentReceiptFormOutput>({
        resolver: zodResolver(paymentReceiptFormSchema),
        defaultValues,
        mode: "onChange",
    })

    async function verifyAccountNumber(accountNumber: string): Promise<boolean> {
        if (!accountNumber) return false

        setAccountCheck({ value: accountNumber, status: "checking", name: null })
        setBillingPeriods([])
        form.setValue("billing_period", "")

        try {
            const res = await fetch(`/api/customers/verify-account?account_number=${encodeURIComponent(accountNumber)}`)
            const json = await res.json()
            const exists = !!json?.data?.exists

            setAccountCheck({ value: accountNumber, status: exists ? "valid" : "invalid", name: json?.data?.name ?? null })
            setBillingPeriods(json?.data?.billing_periods ?? [])

            if (!exists) {
                form.setError("account_number", { message: "Account number not found. Please check and try again." })
            } else if (form.formState.errors.account_number) {
                form.clearErrors("account_number")
            }

            return exists
        } catch {
            setAccountCheck({ value: accountNumber, status: "invalid", name: null })
            form.setError("account_number", { message: "Couldn't verify account number. Please try again." })
            return false
        }
    }

    async function onSubmit(data: PaymentReceiptFormOutput) {
        const isVerified = accountCheck?.value === data.account_number && accountCheck.status === "valid"
        const accountExists = isVerified || (await verifyAccountNumber(data.account_number))

        if (!accountExists) {
            return
        }

        const body = new FormData()
        body.append("account_number", data.account_number)
        body.append("billing_period", data.billing_period)
        body.append("payment_method", data.payment_method)
        body.append("receipt", data.receipt)

        try {
            const res = await fetch("/api/payments/submit-receipt", {
                method: "POST",
                body,
            })
            const json = await res.json()

            if (json.success) {
                toast.success(json.message, { position: "top-right" })
                form.reset(defaultValues)
                setAccountCheck(null)
                setBillingPeriods([])
                setIsSubmitted(true)
            } else {
                toast.error(json.message ?? "Something went wrong. Please try again.", { position: "top-right" })
            }
        } catch {
            toast.error("Something went wrong. Please try again.", { position: "top-right" })
        }
    }

    if (isSubmitted) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Thank you!</CardTitle>
                    <CardDescription>
                        Your payment receipt has been submitted and is being reviewed. We&apos;ll update your account
                        once it&apos;s verified.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => setIsSubmitted(false)}>
                        Submit another receipt
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Submit Payment Receipt</CardTitle>
                <CardDescription>
                    Paid your bill? Fill out this form and attach your receipt so we can verify your payment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="account_number"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Account Number</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="ISP0001"
                                        autoComplete="off"
                                        onBlur={(e) => {
                                            field.onBlur()
                                            if (e.target.value) verifyAccountNumber(e.target.value)
                                        }}
                                    />
                                    {fieldState.invalid ? (
                                        <FieldError errors={[fieldState.error]} />
                                    ) : accountCheck?.value === field.value && accountCheck.status === "valid" ? (
                                        <FieldDescription className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
                                            <CheckCircle2 className="size-3.5" />
                                            Account found{accountCheck.name ? `: ${accountCheck.name}` : ""}
                                        </FieldDescription>
                                    ) : accountCheck?.value === field.value && accountCheck.status === "checking" ? (
                                        <FieldDescription>Verifying account number...</FieldDescription>
                                    ) : null}
                                </Field>
                            )}
                        />

                        <Controller
                            name="billing_period"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Billing Period</FieldLabel>
                                    <Popover open={billingPeriodOpen} onOpenChange={setBillingPeriodOpen}>
                                        <PopoverTrigger
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            disabled={billingPeriods.length === 0}
                                            className="flex w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-accent aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <CalendarIcon className="size-4 text-muted-foreground" />
                                            <span className={field.value ? "" : "text-muted-foreground"}>
                                                {field.value ? formatBillingPeriod(field.value) : "Select the month you're paying for"}
                                            </span>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                value={field.value}
                                                onSelect={(date) => {
                                                    const billingPeriod = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
                                                    field.onChange(billingPeriod)
                                                    setBillingPeriodOpen(false)
                                                }}
                                                disabled={(date) => {
                                                    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
                                                    return !billingPeriods.includes(period)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {fieldState.invalid ? (
                                        <FieldError errors={[fieldState.error]} />
                                    ) : accountCheck?.status === "valid" && billingPeriods.length === 0 ? (
                                        <FieldDescription>No pending billing periods found for this account.</FieldDescription>
                                    ) : accountCheck?.status !== "valid" ? (
                                        <FieldDescription>Enter your account number first.</FieldDescription>
                                    ) : null}
                                </Field>
                            )}
                        />

                        <Controller
                            name="payment_method"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Payment Method</FieldLabel>
                                    <Select
                                        items={paymentMethodOptions}
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {paymentMethodOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="receipt"
                            control={form.control}
                            render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={name}>Receipt Image</FieldLabel>
                                    <Input
                                        id={name}
                                        name={name}
                                        ref={ref}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/heic"
                                        aria-invalid={fieldState.invalid}
                                        onBlur={onBlur}
                                        onChange={(e) => onChange(e.target.files?.[0])}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Spinner /> : "Submit Payment"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
