"use client"
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { UserFormInput, UserFormOutput, userSchema } from '@/schemas/userSchema'
import { createUser } from '@/actions/users/create'
import FormDrawer from '../drawer/FormDrawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const defaultValues: UserFormInput = {
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

export interface TAddCustomerDrawer {
    open: boolean
    setOpen: () => void
    planOptions: { label: string; value: string }[]
    onSuccess: () => void
}

const AddCustomerDrawer: FC<TAddCustomerDrawer> = ({ open, setOpen, planOptions, onSuccess }) => {
    const form = useForm<UserFormInput, unknown, UserFormOutput>({
        defaultValues,
        resolver: zodResolver(userSchema),
        mode: "onChange",
    })

    async function onSubmit(formData: UserFormOutput) {
        const res = await createUser(formData)
        if (res.success) {
            toast.success(res.message, { position: "top-right" })
            form.reset(defaultValues)
            onSuccess()
            setOpen()
        } else {
            toast.error(res.message, { position: "top-right" })
        }
    }

    const onCancel = () => {
        form.reset(defaultValues)
        setOpen()
    }

    return (
        <FormDrawer
            title="Add new customer"
            id="add-new-customer"
            buttonText="Add"
            IsOpen={open}
            form={form}
            setIsOpen={setOpen}
            onCancel={onCancel}
            onSubmit={onSubmit}
            skeletonRows={9}
            formInputs={
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
                                    defaultValue="active"
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
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
            }
        />
    )
}

export default AddCustomerDrawer
