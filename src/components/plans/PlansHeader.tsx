"use client"
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import PageHeaderAction from '../ui/pageHeaderAction'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormValues, servicePlanSchema } from '@/schemas/servicePlanSchema'
import { createServicePlan } from '@/actions/plans/create'
import { toast } from 'sonner'
import FormDrawer from '../drawer/FormDrawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Input } from '../ui/input'

export default function PlansHeader() {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const handleDrawer = () => {
        setOpenDrawer(!openDrawer)
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(servicePlanSchema),
        defaultValues: {
            name: "",
            monthly_fee: "",
            speed: "",
            status: "active"
        },
        mode: "onChange"
    })

    async function onSubmit(data: FormValues) {
        const res = await createServicePlan(data)
        if (res.success) {
            toast.success("New service plan created", { position: "top-right" })
            form.reset()
        } else {
            toast.error(res.message, { position: "top-right" })
        }
    }

    const onCancel = () => {
        form.reset()
        handleDrawer()
    }
    return (
        <>
            <PageHeaderAction
                title='Service Plans Management'
                description='Manage internet plans offered to customers.'
                actionButton={<Button onClick={handleDrawer}><Plus /> Add new plan</Button>}
            >
                <FormDrawer
                    title='Add new plan'
                    id='add-service-plan'
                    formInputs={
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Plan Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Plan 599"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name='speed'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="plan-speed">Plan Speed</FieldLabel>
                                        <InputGroup className="max-w-xs">
                                            <InputGroupInput
                                                {...field}
                                                aria-invalid={fieldState.invalid}
                                                id={field.name}
                                                name={field.name}
                                                required
                                                type='number'
                                                autoComplete="off"
                                                placeholder="50" />
                                            <InputGroupAddon align="inline-end">Mbps</InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="monthly_fee"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="plan-price">Plan Price</FieldLabel>
                                        <Input
                                            {...field}
                                            name={field.name}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            required
                                            type='text'
                                            autoComplete="off"
                                            placeholder="599"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name='status'
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="plan-status">Status</FieldLabel>
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
                    buttonText='Add'
                    IsOpen={openDrawer}
                    form={form}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    setIsOpen={handleDrawer}
                />
            </PageHeaderAction>
        </>
    )
}
