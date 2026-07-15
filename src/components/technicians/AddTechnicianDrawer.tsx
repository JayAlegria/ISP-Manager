"use client"

import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { technicianSchema, TechnicianFormInput, TechnicianFormOutput } from "@/schemas/technicianSchema"
import { createTechnician } from "@/actions/technicians/create"
import FormDrawer from "../drawer/FormDrawer"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const defaultValues: TechnicianFormInput = {
    employee_id: "",
    name: "",
    contact_number: "",
    email: "",
    status: "active",
    specialization: "",
}

export interface TAddTechnicianDrawer {
    open: boolean
    setOpen: () => void
    onSuccess: () => void
}

const AddTechnicianDrawer: FC<TAddTechnicianDrawer> = ({ open, setOpen, onSuccess }) => {
    const form = useForm<TechnicianFormInput, unknown, TechnicianFormOutput>({
        defaultValues,
        resolver: zodResolver(technicianSchema),
        mode: "onChange",
    })

    async function onSubmit(formData: TechnicianFormOutput) {
        const res = await createTechnician(formData)
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
            title="Add Technician"
            id="add-technician"
            buttonText="Add"
            IsOpen={open}
            form={form}
            setIsOpen={setOpen}
            onCancel={onCancel}
            onSubmit={onSubmit}
            formInputs={
                <FieldGroup>
                    <Controller
                        name="employee_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Employee ID</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="EMP001"
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
                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="John Doe"
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
                                    placeholder="09162929887"
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
                                    type="email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="john@example.com"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="specialization"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Specialization</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Fiber Installation (Optional)"
                                    autoComplete="off"
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
                                <FieldLabel htmlFor="technician-status">Status</FieldLabel>
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
                </FieldGroup>
            }
        />
    )
}

export default AddTechnicianDrawer
