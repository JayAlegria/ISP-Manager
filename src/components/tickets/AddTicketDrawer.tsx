"use client"

import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CreateTicketInput, CreateTicketOutput, createTicketSchema } from "@/schemas/ticketSchema"
import { createTicket } from "@/actions/tickets/create"
import FormDrawer from "../drawer/FormDrawer"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const defaultValues: CreateTicketInput = {
    customer_id: "",
    category: "internet_problem",
    description: "",
}

const categoryOptions = [
    { label: "Internet Problem", value: "internet_problem" },
    { label: "Billing Problem", value: "billing_problem" },
    { label: "Relocation", value: "relocation" },
    { label: "Installation", value: "installation" },
]

interface AddTicketDrawerProps {
    open: boolean
    setOpen: () => void
    customers: Array<{ id: string; name: string; account_number: string }>
    onSuccess: () => void
}

const AddTicketDrawer: FC<AddTicketDrawerProps> = ({ open, setOpen, customers, onSuccess }) => {
    const form = useForm<CreateTicketInput, unknown, CreateTicketOutput>({
        defaultValues,
        resolver: zodResolver(createTicketSchema),
        mode: "onChange",
    })

    const customerOptions = customers.map((customer) => ({
        label: `${customer.name} (${customer.account_number})`,
        value: customer.id,
    }))

    async function onSubmit(formData: CreateTicketOutput) {
        const res = await createTicket(formData)
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
            title="Create Support Ticket"
            id="add-ticket"
            buttonText="Create"
            IsOpen={open}
            form={form}
            setIsOpen={setOpen}
            onCancel={onCancel}
            onSubmit={onSubmit}
            skeletonRows={3}
            formInputs={
                <FieldGroup>
                    <Controller
                        name="customer_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="customer-id">Customer</FieldLabel>
                                <Select
                                    {...field}
                                    items={customerOptions}
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {customerOptions.map((option) => (
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
                        name="category"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="category">Category</FieldLabel>
                                <Select
                                    {...field}
                                    items={categoryOptions}
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categoryOptions.map((option) => (
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
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Describe the issue or request..."
                                    className="min-h-24"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </FieldGroup>
            }
        />
    )
}

export default AddTicketDrawer
