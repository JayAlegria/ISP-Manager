"use client"
import { EllipsisVertical, Edit, Ban, Trash, RotateCcw } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '../ui/table'
import { Button } from '../ui/button'
import { FC, useState } from 'react'
import { Badge } from '../ui/badge'
import { deleteServicePlan } from '@/actions/plans/delete'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { Skeleton } from '../ui/skeleton'
import { FormValues } from '@/schemas/servicePlanSchema'
import { updateServicePlan } from '@/actions/plans/update'
import { TPlans } from '@/types/plans'
import { TActionResponse } from '@/types/response'

interface TPlansTable {
    plans: TPlans[]
}
const PlansTable: FC<TPlansTable> = ({ plans }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const executeAction = async (
        action: () => Promise<TActionResponse<unknown>>
    ) => {
        setIsLoading(true);

        try {
            const res = await action();

            if (res.success) {
                toast.success(res.message, { position: "top-right" });
            } else {
                toast.error(res.message, { position: "top-right" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePlan = (id: string) =>
        executeAction(() => deleteServicePlan(id));

    const handleDisablePlan = (plan: TPlans) =>
        executeAction(() =>
            updateServicePlan(
                {
                    ...plan,
                    status: "inactive",
                    speed: plan.speed.toString()
                },
                plan.id.toString()
            )
        );

    const handleEnablePlan = (plan: TPlans) =>
        executeAction(() =>
            updateServicePlan(
                {
                    ...plan,
                    status: "active",
                    speed: plan.speed.toString()
                },
                plan.id.toString()
            )
        );
    return (
        <Table className='mt-5'>
            <TableCaption>List of service plans</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Monthly</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            {isLoading
                ? <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                : <TableBody>
                    {
                        plans.map(plan => (
                            <TableRow key={plan.id}>
                                <TableCell>{plan.name}</TableCell>
                                <TableCell>{plan.speed} Mbps</TableCell>
                                <TableCell>P{plan.monthly_fee}</TableCell>
                                <TableCell>
                                    {
                                        plan.status?.toLowerCase() === "active" &&
                                        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                                            {plan.status?.toLowerCase()}
                                        </Badge>
                                    }
                                    {
                                        plan.status?.toLowerCase() === "inactive" &&
                                        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                                            {plan.status?.toLowerCase()}
                                        </Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger render={<Button variant="ghost"> <EllipsisVertical /></Button>} />
                                        <DropdownMenuContent>
                                            <DropdownMenuItem><Edit /> Edit</DropdownMenuItem>

                                            {plan.status === "active" &&
                                                <DropdownMenuItem className="text-red-400" onClick={() => handleDisablePlan(plan)}><Ban /> Disable</DropdownMenuItem>
                                            }
                                            {plan.status === "inactive" &&
                                                <DropdownMenuItem onClick={() => handleEnablePlan(plan)}><RotateCcw /> Enable</DropdownMenuItem>
                                            }
                                            <DropdownMenuItem className="text-red-400" onClick={() => handleDeletePlan(plan.id.toString())}><Trash />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            }
        </Table>

    )
}

export default PlansTable