"use client"
import { getServicePlans } from '@/actions/plans/get'
import { Field } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useEffect, useState } from 'react'
import { TPlanFilter, TPlans } from '@/types/plans'

export default function TableFilter() {
    const [planList, setPlanList] = useState<{ label: string, value: string }[]>([])

    const statusFilter = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
    ]


    useEffect(() => {
        (
            async () => {
                const plans = await getServicePlans()
                if (plans.data) {
                    setPlanList(plans.data.map((plan) => (
                        {
                            label: plan.name,
                            value: plan.plan_id
                        }
                    )))
                }
            }
        )()
    }, [])
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 justify-between'>
            <Field>
                <Input placeholder='Juan Dela Cruz' type='search' />
            </Field>
            <Field className="w-full">
                <Select items={statusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {statusFilter.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>
            <Field className="w-full">
                <Select items={planList}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select plan type' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {planList?.map((plan) => (
                                <SelectItem key={plan.value} value={plan.value}>
                                    {plan.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>
        </div>
    )
}
