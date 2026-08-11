"use client"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
    InstallationRequestInput,
    InstallationRequestOutput,
    installationRequestSchema,
} from "@/schemas/installationRequestSchema"
import { TPlanLookupResult } from "@/util/planQueries"

const defaultValues: InstallationRequestInput = {
    name: "",
    contact_number: "",
    email: "",
    address: "",
    plan_id: "",
}

interface InstallationRequestFormProps {
    plans: TPlanLookupResult[]
}

export function InstallationRequestForm({ plans }: InstallationRequestFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const planOptions = plans.map((plan) => ({
        label: `${plan.name} — ₱${plan.monthly_fee}/mo, ${plan.speed} Mbps`,
        value: plan.id,
    }))

    const form = useForm<InstallationRequestInput, unknown, InstallationRequestOutput>({
        resolver: zodResolver(installationRequestSchema),
        defaultValues,
        mode: "onChange",
    })

    async function onSubmit(data: InstallationRequestOutput) {
        try {
            const res = await fetch("/api/installation/submit-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            const json = await res.json()

            if (json.success) {
                toast.success(json.message, { position: "top-right" })
                form.reset(defaultValues)
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
                        Your installation request has been received. Our team will contact you shortly to schedule
                        your installation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => setIsSubmitted(false)}>
                        Submit another request
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Request Installation</CardTitle>
                <CardDescription>
                    Fill out this form and we&apos;ll reach out to schedule your installation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Juan Dela Cruz"
                                        autoComplete="name"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="contact_number"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="09XXXXXXXXX"
                                        autoComplete="tel"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="juan@example.com"
                                        autoComplete="email"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Complete Address</FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="House/Unit No., Street, Barangay, City, Province"
                                        autoComplete="street-address"
                                        rows={3}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="plan_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Preferred Plan</FieldLabel>
                                    <Select
                                        items={planOptions}
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                                            <SelectValue placeholder="Select a plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {planOptions.map((option) => (
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

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Spinner /> : "Submit Request"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
