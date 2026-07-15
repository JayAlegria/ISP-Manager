"use client"

import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { TTechnician } from "@/types/technicians"
import { technicianSchema, TechnicianFormInput, TechnicianFormOutput } from "@/schemas/technicianSchema"
import { updateTechnician } from "@/actions/technicians/update"
import FormDrawer from "../drawer/FormDrawer"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"

interface UpdateTechnicianDrawerProps {
    open: boolean
    setOpen: () => void
    technician?: TTechnician
    isViewMode?: boolean
    setIsViewMode?: (mode: boolean) => void
    onSuccess: () => void
}

const UpdateTechnicianDrawer: FC<UpdateTechnicianDrawerProps> = ({
    open,
    setOpen,
    technician,
    isViewMode,
    setIsViewMode,
    onSuccess,
}) => {
    const form = useForm<TechnicianFormInput, unknown, TechnicianFormOutput>({
        resolver: zodResolver(technicianSchema),
        mode: "onChange",
        values: {
            employee_id: technician?.employee_id ?? "",
            name: technician?.name ?? "",
            contact_number: technician?.contact_number ?? "",
            email: technician?.email ?? "",
            status: (technician?.status as "active" | "inactive") ?? "active",
            specialization: technician?.specialization ?? "",
        },
    })

    async function onSubmit(formData: TechnicianFormOutput) {
        if (!technician?.id) return

        const res = await updateTechnician(technician.id, formData)
        if (res.success) {
            toast.success(res.message, { position: "top-right" })
            onSuccess()
            setOpen()
            if (setIsViewMode) setIsViewMode(false)
        } else {
            toast.error(res.message, { position: "top-right" })
        }
    }

    const onCancel = () => {
        setOpen()
        if (setIsViewMode) setIsViewMode(false)
    }

    const handleEditToggle = () => {
        if (setIsViewMode) {
            setIsViewMode(!isViewMode)
        }
    }

    return (
        <FormDrawer
            title={isViewMode ? "View Technician" : "Edit Technician"}
            id="update-technician"
            buttonText={isViewMode ? "Edit" : "Update"}
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
                                    disabled={isViewMode}
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
                                    disabled={isViewMode}
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
                                    disabled={isViewMode}
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
                                    disabled={isViewMode}
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
                                    disabled={isViewMode}
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
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isViewMode}
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
            isSubmitHidden
        />
    )
}

export default UpdateTechnicianDrawer
