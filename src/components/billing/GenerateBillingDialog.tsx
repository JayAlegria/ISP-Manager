"use client"
import { FC, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { GenerateBillingInput, GenerateBillingOutput, generateBillingSchema } from '@/schemas/billingSchema'
import { CalendarIcon } from 'lucide-react'

export interface TGenerateBillingDialog {
    open: boolean
    setOpen: () => void
    onGenerate: (billingPeriod: string) => void
    isGenerating: boolean
}

const GenerateBillingDialog: FC<TGenerateBillingDialog> = ({ open, setOpen, onGenerate, isGenerating }) => {
    const [popoverOpen, setPopoverOpen] = useState(false)
    const form = useForm<GenerateBillingInput, unknown, GenerateBillingOutput>({
        resolver: zodResolver(generateBillingSchema),
        defaultValues: {
            billing_period: "",
        },
        mode: "onChange",
    })

    async function onSubmit(formData: GenerateBillingOutput) {
        await onGenerate(formData.billing_period)
        form.reset()
        setOpen()
    }

    const onCancel = () => {
        form.reset()
        setOpen()
    }

    const handleDateSelect = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const billingPeriod = `${year}-${month}`
        form.setValue('billing_period', billingPeriod, { shouldValidate: true })
        setPopoverOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form onSubmit={form.handleSubmit(onSubmit)} id="generate-billing">
                    <DialogHeader>
                        <DialogTitle>Generate Monthly Billing</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <Controller
                            name="billing_period"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Billing Period</FieldLabel>
                                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                        <PopoverTrigger
                                            className="w-full flex items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isGenerating}
                                        >
                                            <CalendarIcon className="h-4 w-4" />
                                            <span className="text-left flex-1">{field.value || "Pick a month"}</span>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                value={field.value}
                                                onSelect={handleDateSelect}
                                                disabled={(date: Date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            This will generate bills for all active customers for the specified period.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
                            Cancel
                        </Button>
                        <Button type="submit" form="generate-billing" disabled={isGenerating}>
                            {isGenerating ? <Spinner /> : "Generate"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateBillingDialog
