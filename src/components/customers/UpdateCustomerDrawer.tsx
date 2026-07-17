"use client"
import { FC, useEffect } from 'react'
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
import { UserFormInput, UserFormOutput, userSchema } from '@/schemas/userSchema'
import { updateCustomer } from '@/actions/users/update'
import { TCustomer } from '@/types/customers'

const emptyValues: UserFormInput = {
    account_number: "",
    name: "",
    facebook_name: "",
    contact_number: "",
    address: "",
    status: "active",
    plan: "",
    email: "",
    billing_day: 1,
}

export interface TUpdateCustomerDrawer {
    open: boolean
    setOpen: () => void
    customer?: TCustomer
    planOptions: { label: string; value: string }[]
    readOnly?: boolean
    onSuccess: () => void
}

const UpdateCustomerDrawer: FC<TUpdateCustomerDrawer> = ({ open, setOpen, customer, planOptions, readOnly = false, onSuccess }) => {
    const form = useForm<UserFormInput, unknown, UserFormOutput>({
        resolver: zodResolver(userSchema),
        defaultValues: emptyValues,
        mode: "onChange",
    })

    useEffect(() => {
        if (customer) {
            form.reset({
                account_number: customer.account_number,
                name: customer.name ?? "",
                facebook_name: customer.facebook_name,
                contact_number: customer.contact_number ?? "",
                address: customer.address ?? "",
                status: customer.status === "active" ? "active" : "inactive",
                plan: customer.plan ?? "",
                email: customer.email ?? "",
                billing_day: customer.billing_day ?? 1,
            });
        } else {
            form.reset(emptyValues);
        }
    }, [customer, form]);

    async function onSubmit(formData: UserFormOutput) {
        if (!customer) return;

        const res = await updateCustomer(formData, customer.id)
        if (res.success) {
            toast.success(res.message, { position: "top-right" })
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
                <form onSubmit={form.handleSubmit(onSubmit)} id="update-customer" className="flex min-h-0 flex-1 flex-col">
                    <DrawerHeader className="py-5">
                        <DrawerTitle className="font-bold">
                            {readOnly ? `User details` : `Update user details`}
                        </DrawerTitle>
                    </DrawerHeader>
                    <Separator />
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                        {form.formState.isSubmitting ? <FormSkeleton rows={9} /> : (
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
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ISP0001"
                                            autoComplete="off"
                                            disabled={readOnly}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Customer Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Juan Dela Cruz"
                                            autoComplete="off"
                                            disabled={readOnly}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="facebook_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Facebook Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Juan Dela Cruz"
                                            autoComplete="off"
                                            disabled={readOnly}
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
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="09171234567"
                                            autoComplete="off"
                                            disabled={readOnly}
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
                                        <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Barangay Dos, Pilapil"
                                            autoComplete="off"
                                            disabled={readOnly}
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
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="jdc@gmail.com"
                                            autoComplete="off"
                                            type="email"
                                            disabled={readOnly}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="billing_day"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Billing day</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            value={Number(field.value)}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="31"
                                            autoComplete="off"
                                            type="number"
                                            min={1}
                                            max={31}
                                            disabled={readOnly}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="status"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="customer-status">Status</FieldLabel>
                                        <Select
                                            {...field}
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={readOnly}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="active">active</SelectItem>
                                                    <SelectItem value="inactive">inactive</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="plan"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="customer-plan">Plan type</FieldLabel>
                                        <Select
                                            {...field}
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            items={planOptions}
                                            disabled={readOnly}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Select plan type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {planOptions.map((plan) => (
                                                        <SelectItem key={plan.value} value={plan.value}>
                                                            {plan.label}
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
                    {readOnly ? (
                        <Button className="bg-gray-200 text-foreground hover:text-background" onClick={setOpen}>Close</Button>
                    ) : (
                        <>
                            <Button type="submit" form="update-customer">
                                {form.formState.isSubmitting ? <Spinner /> : "Update Customer"}
                            </Button>
                            <Button className="bg-gray-200 text-foreground hover:text-background" onClick={onCancel}>Cancel</Button>
                        </>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
export default UpdateCustomerDrawer;
