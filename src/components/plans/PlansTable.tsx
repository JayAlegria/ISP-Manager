"use client"
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '../ui/table'
import { Button } from '../ui/button'
import { FC, useState } from 'react'
import { Badge } from '../ui/badge'
import { deleteServicePlan } from '@/actions/plans/delete'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'
import { FormValues } from '@/schemas/servicePlanSchema'
import { updateServicePlan } from '@/actions/plans/update'
import { TPlans } from '@/types/plans'
import { TActionResponse } from '@/types/response'
import UpdatePlanDrawer from './UpdatePlanDrawer'
import { flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import { getColumns } from "./Columns";

interface TPlansTable {
    plans: TPlans[]
}

const PlansTable: FC<TPlansTable> = ({ plans }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = useState<FormValues>({
        name: "",
        monthly_fee: "",
        speed: "",
        status: "inactive"
    })

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

    const handleDeletePlan = (id: string) => executeAction(() => deleteServicePlan(id));

    const handleDisablePlan = (plan: TPlans) => {
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
    }

    const handleEnablePlan = (plan: TPlans) => {
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
    }

    const handleUpdateDrawer = (plan?: any) => {
        setSelectedPlan(plan)
        setOpenUpdateDrawer(!openUpdateDrawer)
    }

    const table = useReactTable({
        data: plans,
        columns: getColumns({
            onEdit: handleUpdateDrawer,
            onDelete: handleDeletePlan,
            onEnable: handleEnablePlan,
            onDisable: handleDisablePlan,
        }),

        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='border rounded-2xl p-2 mt-5'>
            <Table className='mt-5'>
                <TableCaption>List of service plans</TableCaption>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
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
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                }
            </Table>
            <UpdatePlanDrawer open={openUpdateDrawer} setOpen={handleUpdateDrawer} plan={selectedPlan} />
        </div>

    )
}

export default PlansTable