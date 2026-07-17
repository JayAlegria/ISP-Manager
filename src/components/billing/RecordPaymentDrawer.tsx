"use client"
import { FC } from 'react'
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { FormSkeleton } from '../drawer/FormSkeleton'
import { RecordPaymentInput, RecordPaymentOutput, recordPaymentSchema } from '@/schemas/billingSchema'
import { recordPayment } from '@/actions/billing/payment'
import { TBillingWithCustomer } from '@/types/billing'
import { paymentMethodLabels } from '@/types/payments'

const paymentMethodOptions = Object.entries(paymentMethodLabels).map(([value, label]) => ({ label, value }))

const emptyValues: RecordPaymentInput = {
    reference_number: "",
    amount: "",
    payment_method: "",
}

export interface TRecordPaymentDrawer {
    open: boolean
    setOpen: () => void
    billing?: TBillingWithCustomer
    onSuccess: () => void
}

const RecordPaymentDrawer: FC<TRecordPaymentDrawer> = ({ open, setOpen, billing, onSuccess }) => {
    const form = useForm<RecordPaymentInput, unknown, RecordPaymentOutput>({
        resolver: zodResolver(recordPaymentSchema),
        defaultValues: emptyValues,
        mode: "onChange",
    })

    async function onSubmit(formData: RecordPaymentOutput) {
        if (!billing) return

        const res = await recordPayment(billing.id.toString(), formData)
        if (res.success) {
            toast.success(res.message, { position: "top-right" })
            form.reset(emptyValues)
            onSuccess()
            setOpen()
        } else {
            toast.error(res.message, { position: "top-right" })
        }
    }

    const onCancel = () => {
        form.reset(emptyValues)
        setOpen()
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
            <DrawerContent>
                <form onSubmit={form.handleSubmit(onSubmit)} id="record-payment" className='flex min-h-0 flex-1 flex-col'>
                    <DrawerHeader className='py-5'>
                        <DrawerTitle className="font-bold">Record Payment</DrawerTitle>
                    </DrawerHeader>
                    <Separator />
                    <div className='min-h-0 flex-1 overflow-y-auto px-5 py-5'>
                        <div className='text-sm mb-4'>
                            <p className='text-muted-foreground mb-1'>Billing Period:</p>
                            <p className='font-semibold'>{billing?.billing_period}</p>
                        </div>
                        <div className='text-sm mb-4'>
                            <p className='text-muted-foreground mb-1'>Expected Amount:</p>
                            <p className='font-semibold text-lg'>₱{billing?.amount}</p>
                        </div>

                        {form.formState.isSubmitting ? <FormSkeleton rows={3} /> : (
                        <FieldGroup>
                            <Controller
                                name="amount"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Payment Amount</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="₱0.00"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="reference_number"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Reference Number</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Transaction/Check Number"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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

                        </FieldGroup>
                        )}
                    </div>
                </form>
                <DrawerFooter>
                    <Button type="submit" form="record-payment">
                        {form.formState.isSubmitting ? <Spinner /> : "Record Payment"}
                    </Button>
                    <Button className="bg-gray-200 text-foreground hover:text-background" onClick={onCancel}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default RecordPaymentDrawer
