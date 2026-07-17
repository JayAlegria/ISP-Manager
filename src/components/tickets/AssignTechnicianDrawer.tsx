"use client"

import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { AssignTechnicianInput, AssignTechnicianOutput, assignTechnicianSchema } from "@/schemas/ticketSchema"
import { assignTechnician } from "@/actions/tickets/update"
import FormDrawer from "../drawer/FormDrawer"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { TTicketWithRelations } from "@/types/tickets"

const defaultValues: AssignTechnicianInput = {
    technician_id: "",
}

interface AssignTechnicianDrawerProps {
    open: boolean
    setOpen: () => void
    ticket?: TTicketWithRelations
    technicians: Array<{ id: string; name: string; employee_id: string }>
    onSuccess: () => void
}

const AssignTechnicianDrawer: FC<AssignTechnicianDrawerProps> = ({
    open,
    setOpen,
    ticket,
    technicians,
    onSuccess,
}) => {
    const form = useForm<AssignTechnicianInput, unknown, AssignTechnicianOutput>({
        defaultValues,
        resolver: zodResolver(assignTechnicianSchema),
        mode: "onChange",
    })

    const technicianOptions = technicians
        .filter((t) => t.id)
        .map((technician) => ({
            label: `${technician.name} (${technician.employee_id})`,
            value: technician.id,
        }))

    async function onSubmit(formData: AssignTechnicianOutput) {
        if (!ticket?.id) return

        const res = await assignTechnician(ticket.id, formData.technician_id)
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
            title="Assign Technician"
            id="assign-technician"
            buttonText="Assign"
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
                        <p className="text-sm text-muted-foreground">Customer: {ticket?.user?.name}</p>
                    </div>

                    <Controller
                        name="technician_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="technician-id">Select Technician</FieldLabel>
                                <Select
                                    {...field}
                                    items={technicianOptions}
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Select a technician" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {technicianOptions.map((option) => (
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
            }
        />
    )
}

export default AssignTechnicianDrawer
