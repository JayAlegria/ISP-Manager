"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { TTechnician } from "@/types/technicians"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TechnicianActions } from "./TechnicianActions"

interface TechnicianColumnActions {
    onView: (technician: TTechnician) => void
    onEdit: (technician: TTechnician) => void
    onDeactivate: (technician: TTechnician) => void
    onReactivate: (technician: TTechnician) => void
    onDelete: (technician: TTechnician) => void
}

function SortableHeader({ label, column }: { label: string; column: Column<TTechnician, unknown> }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-2.5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {label}
            <ArrowUpDown />
        </Button>
    )
}

const statusColors: Record<string, string> = {
    active: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    inactive: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
}

export function getColumns(actions: TechnicianColumnActions): ColumnDef<TTechnician>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "employee_id",
            header: ({ column }) => <SortableHeader label="Employee ID" column={column} />,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <SortableHeader label="Name" column={column} />,
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "contact_number",
            header: "Contact Number",
        },
        {
            accessorKey: "specialization",
            header: "Specialization",
            cell: ({ row }) => row.original.specialization || "—",
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader label="Status" column={column} />,
            cell: ({ row }) => {
                const status = row.original.status
                const colorClass = status ? statusColors[status] : "bg-muted text-muted-foreground"
                return (
                    <Badge className={colorClass}>
                        {status?.toLowerCase() ?? "unknown"}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <TechnicianActions
                    technician={row.original}
                    onView={actions.onView}
                    onEdit={actions.onEdit}
                    onDeactivate={actions.onDeactivate}
                    onReactivate={actions.onReactivate}
                    onDelete={actions.onDelete}
                />
            ),
        },
    ]
}
