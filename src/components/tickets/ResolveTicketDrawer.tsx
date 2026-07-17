"use client"

import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ResolveTicketInput, ResolveTicketOutput, resolveTicketSchema } from "@/schemas/ticketSchema"
import { resolveTicket } from "@/actions/tickets/update"
import FormDrawer from "../drawer/FormDrawer"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { TTicketWithRelations, ticketStatusLabels } from "@/types/tickets"

const defaultValues: ResolveTicketInput = {
    resolution_notes: "",
}

interface ResolveTicketDrawerProps {
    open: boolean
    setOpen: () => void
    ticket?: TTicketWithRelations
    onSuccess: () => void
}

const ResolveTicketDrawer: FC<ResolveTicketDrawerProps> = ({ open, setOpen, ticket, onSuccess }) => {
    const form = useForm<ResolveTicketInput, unknown, ResolveTicketOutput>({
        defaultValues,
        resolver: zodResolver(resolveTicketSchema),
        mode: "onChange",
    })

    async function onSubmit(formData: ResolveTicketOutput) {
        if (!ticket?.id) return

        const res = await resolveTicket(ticket.id, formData.resolution_notes)
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
            title="Resolve Ticket"
            id="resolve-ticket"
            buttonText="Resolve"
            IsOpen={open}
            form={form}
            setIsOpen={setOpen}
            onCancel={onCancel}
            onSubmit={onSubmit}
            skeletonRows={1}
            formInputs={
                <FieldGroup>
                    <div className="mb-4 p-3 bg-muted rounded">
                        <p className="text-sm font-medium">Ticket: {ticket?.ticket_number}</p>
                        <p className="text-sm text-muted-foreground">
                            Status: {ticket?.status ? ticketStatusLabels[ticket.status] ?? ticket.status : "—"}
                        </p>
                    </div>

                    <Controller
                        name="resolution_notes"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="resolution-notes">Resolution Notes</FieldLabel>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Describe how the issue was resolved (optional)..."
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

export default ResolveTicketDrawer
