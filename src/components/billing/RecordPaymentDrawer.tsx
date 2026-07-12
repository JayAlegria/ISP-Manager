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
import { RecordPaymentInput, RecordPaymentOutput, recordPaymentSchema } from '@/schemas/billingSchema'
import { recordPayment } from '@/actions/billing/payment'
import { TBillingWithCustomer } from '@/types/billing'

const emptyValues: RecordPaymentInput = {
    reference_number: "",
    amount: "",
    verification_status: "MANUAL_REVIEW",
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

    const verificationStatus: { label: string, value: string }[] = [
        {
            label: "Manual Review",
            value: "MANUAL_REVIEW"
        },
        {
            label: "Auto Verified",
            value: "AUTO_VERIFIED"
        },
        {
            label: "Pending",
            value: "PENDING"
        }

    ]

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
                        <FieldGroup>
                            <div className='text-sm mb-4'>
                                <p className='text-muted-foreground mb-1'>Billing Period:</p>
                                <p className='font-semibold'>{billing?.billing_period}</p>
                            </div>
                            <div className='text-sm mb-4'>
                                <p className='text-muted-foreground mb-1'>Expected Amount:</p>
                                <p className='font-semibold text-lg'>₱{billing?.amount}</p>
                            </div>

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
                                control={form.control}
                                name="verification_status"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="verification-status">Verification Status</FieldLabel>
                                        <Select
                                            {...field}
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            items={verificationStatus}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {verificationStatus.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
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
