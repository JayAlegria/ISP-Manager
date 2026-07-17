"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { TTicketWithRelations, ticketStatusLabels } from "@/types/tickets"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TicketActions } from "./TicketActions"

interface TicketColumnActions {
    onView: (ticket: TTicketWithRelations) => void
    onEdit: (ticket: TTicketWithRelations) => void
    onAssign: (ticket: TTicketWithRelations) => void
    onChangeStatus: (ticket: TTicketWithRelations, status: string) => void
    onResolve: (ticket: TTicketWithRelations) => void
    onClose: (ticket: TTicketWithRelations) => void
    onCancel: (ticket: TTicketWithRelations) => void
}

function SortableHeader({ label, column }: { label: string; column: Column<TTicketWithRelations, unknown> }) {
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
    OPEN: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    ASSIGNED: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    IN_PROGRESS: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    RESOLVED: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    CLOSED: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
    CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
}

const categoryColors: Record<string, string> = {
    internet_problem: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    billing_problem: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
    relocation: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    installation: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
}

export function getColumns(actions: TicketColumnActions): ColumnDef<TTicketWithRelations>[] {
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
            accessorKey: "ticket_number",
            header: ({ column }) => <SortableHeader label="Ticket #" column={column} />,
        },
        {
            accessorKey: "user.name",
            header: "Customer",
            cell: ({ row }) => row.original.user?.name || "—",
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => {
                const category = row.original.category
                const colorClass = categoryColors[category] || "bg-gray-50 text-gray-700"
                return (
                    <Badge className={colorClass}>
                        {category?.replace(/_/g, " ") || "unknown"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "technician.name",
            header: "Technician",
            cell: ({ row }) => row.original.technician?.name || "—",
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader label="Status" column={column} />,
            cell: ({ row }) => {
                const status = row.original.status
                const colorClass = statusColors[status] || "bg-muted text-muted-foreground"
                return (
                    <Badge className={colorClass}>
                        {ticketStatusLabels[status] ?? status ?? "Unknown"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => <SortableHeader label="Created" column={column} />,
            cell: ({ row }) => {
                if (!row.original.created_at) return "—"
                const date = new Date(row.original.created_at)
                return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <TicketActions
                    ticket={row.original}
                    onView={actions.onView}
                    onEdit={actions.onEdit}
                    onAssign={actions.onAssign}
                    onChangeStatus={actions.onChangeStatus}
                    onResolve={actions.onResolve}
                    onClose={actions.onClose}
                    onCancel={actions.onCancel}
                />
            ),
        },
    ]
}
