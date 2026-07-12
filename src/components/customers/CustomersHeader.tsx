"use client"
import PageHeaderAction from '../ui/pageHeaderAction'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserFormInput, UserFormOutput, userSchema } from '@/schemas/userSchema'
import FormDrawer from '../drawer/FormDrawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { getServicePlans } from '@/actions/plans/get'
import { createUser } from '@/actions/users/create'
import { toast } from 'sonner'

export default function CustomersHeader() {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [planList, setPlanList] = useState<{ label: string, value: string }[]>([])
    const handleDrawer = () => {
        setOpenDrawer(!openDrawer)
    }
    const form = useForm<UserFormInput>({
        defaultValues: {
            account_number: "",
            name: "",
            facebook_name: "",
            address: "",
            status: "active",
            plan: "",
            email: "",
            billing_day: 31
        },
        resolver: zodResolver(userSchema),
        mode: "onChange"
    })
    async function onSubmit (formData: UserFormOutput){
        const res = await createUser(formData)
        if(res) {
            toast.success(res.message, {position: 'top-right'})
        } else {
            toast.error("Failed creating customer", {position: 'top-right'})
        }
    }
    const onCancel = () => {
        form.reset()
        handleDrawer()
    }

    useEffect(() => {
        (
            async () => {
                const plans = await getServicePlans()
                if (plans.data) {
                    setPlanList(
                        plans.data.map(plan => ({ label: plan.name, value: plan.id.toLocaleString() }))
                    )
                }
            }
        )()
    }, [])
    return (
        <PageHeaderAction
            title='Customer Management'
            description='Create, delete and update customers details.'
            actionButton={<Button onClick={handleDrawer}><Plus /> Add new customer</Button>}>
            <FormDrawer
                title='Add new customer'
                id='add-new-customer'
                buttonText='Add'
                IsOpen={openDrawer}
                form={form}
                setIsOpen={handleDrawer}
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
                                        type='email'
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
                                        type='number'
                                        min={1}
                                        max={31}
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

                         <Controller
                            control={form.control}
                            name='plan'
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="plan-status">Plan type</FieldLabel>
                                    <Select
                                        {...field}
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        items={planList}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select plan type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {planList.map(plan => (
                                                    <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
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
                onCancel={onCancel}
                onSubmit={onSubmit}

            />
        </PageHeaderAction>
    )
}
