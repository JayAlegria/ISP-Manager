"use client"

import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { UpdateTicketInput, UpdateTicketOutput, updateTicketSchema } from "@/schemas/ticketSchema"
import { updateTicket } from "@/actions/tickets/update"
import FormDrawer from "../drawer/FormDrawer"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { TTicketWithRelations } from "@/types/tickets"

const categoryOptions = [
    { label: "Internet Problem", value: "internet_problem" },
    { label: "Billing Problem", value: "billing_problem" },
    { label: "Relocation", value: "relocation" },
    { label: "Installation", value: "installation" },
]

interface UpdateTicketDrawerProps {
    open: boolean
    setOpen: () => void
    ticket?: TTicketWithRelations
    onSuccess: () => void
}

const UpdateTicketDrawer: FC<UpdateTicketDrawerProps> = ({ open, setOpen, ticket, onSuccess }) => {
    const form = useForm<UpdateTicketInput, unknown, UpdateTicketOutput>({
        resolver: zodResolver(updateTicketSchema),
        mode: "onChange",
        values: {
            category: (ticket?.category as any) || "internet_problem",
            description: ticket?.description || "",
        },
    })

    async function onSubmit(formData: UpdateTicketOutput) {
        if (!ticket?.id) return

        const res = await updateTicket(ticket.id, formData)
        if (res.success) {
            toast.success(res.message, { position: "top-right" })
            onSuccess()
            setOpen()
        } else {
            toast.error(res.message, { position: "top-right" })
        }
    }

    const onCancel = () => {
        setOpen()
    }

    return (
        <FormDrawer
            title="Edit Ticket"
            id="update-ticket"
            buttonText="Update"
            IsOpen={open}
            form={form}
            setIsOpen={setOpen}
            onCancel={onCancel}
            onSubmit={onSubmit}
            skeletonRows={2}
            formInputs={
                <FieldGroup>
                    <div className="mb-4 p-3 bg-muted rounded">
                        <p className="text-sm font-medium">Ticket: {ticket?.ticket_number}</p>
                        <p className="text-sm text-muted-foreground">Status: {ticket?.status}</p>
                    </div>

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

export default UpdateTicketDrawer
