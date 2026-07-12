"use client"
import { FC, useEffect } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Controller, useForm } from "react-hook-form";
import { FormValues, servicePlanSchema } from '@/schemas/servicePlanSchema'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { updateServicePlan } from '@/actions/plans/update'


export interface TAddPlanDrawer {
    open: boolean,
    setOpen: () => void,
    plan?: FormValues & {
        id?: string
    }
}

const UpdatePlanDrawer: FC<TAddPlanDrawer> = ({ open, setOpen, plan }) => {
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

    useEffect(() => {
        if (plan) {
            form.reset({
                name: plan.name,
                monthly_fee: plan.monthly_fee,
                speed: plan.speed ?? 0,
                status: plan.status === "active" ? "active" : "inactive",
            });
        } else {
            form.reset({
                name: "",
                monthly_fee: "",
                speed: "0",
                status: "active",
            });
        }
    }, [plan, form]);

    async function onSubmit(data: FormValues) {
        const res = await updateServicePlan(data, plan?.id || "")
        if (res.success) {
            toast.success("Plan updated", { position: "top-right" })
            setOpen()
        } else {
            toast.error(res.message, { position: "top-right" })
        }
    }

    const onCancel = () => {
        form.reset()
        setOpen()
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} swipeDirection='right'>
            <DrawerContent>
                <form onSubmit={form.handleSubmit(onSubmit)} id='update-service-plan'>
                    <DrawerHeader className='py-5'>
                        <DrawerTitle className="font-bold">Update {`${plan?.name}`}</DrawerTitle>
                    </DrawerHeader>
                    <Separator />
                    <div className='mt-5 px-5'>
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
                    </div>
                </form>
                <DrawerFooter >
                    <Button type='submit' form='update-service-plan'>{form.formState.isSubmitting ? <Spinner /> : "Update Plan"}</Button>
                    <Button className="bg-gray-200 text-foreground hover:text-background" onClick={onCancel}>Cancel</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
export default UpdatePlanDrawer;