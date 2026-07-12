"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TBillingWithCustomer, TBillingStatus } from "@/types/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BillingActions } from "./BillingActions";

interface BillingColumnActions {
    onView: (billing: TBillingWithCustomer) => void;
    onRecordPayment: (billing: TBillingWithCustomer) => void;
    onVoid: (billing: TBillingWithCustomer) => void;
}

function SortableHeader({ label, column }: { label: string; column: Column<TBillingWithCustomer, unknown> }) {
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
    );
}

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    PAID: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    OVERDUE: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    VOID: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
};

export function getColumns(actions: BillingColumnActions): ColumnDef<TBillingWithCustomer>[] {
    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "billing_period",
            header: ({ column }) => <SortableHeader label="Billing Period" column={column} />,
        },
        {
            accessorKey: "customer.account_number",
            header: "Account Number",
            cell: ({ row }) => row.original.customer?.account_number || "—",
        },
        {
            accessorKey: "customer.name",
            header: ({ column }) => <SortableHeader label="Customer Name" column={column} />,
            cell: ({ row }) => row.original.customer?.name || "—",
        },
        {
            accessorKey: "customer.plans.name",
            header: "Plan",
            cell: ({ row }) => row.original.customer?.plans?.name ?? "Unassigned",
        },
        {
            accessorKey: "amount",
            header: "Billing Amount",
            cell: ({ row }) => (row.original.amount ? `₱${row.original.amount}` : "—"),
        },
        {
            accessorKey: "due_date",
            header: ({ column }) => <SortableHeader label="Due Date" column={column} />,
            cell: ({ row }) => {
                if (!row.original.due_date) return "—";
                const date = new Date(row.original.due_date);
                return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader label="Status" column={column} />,
            cell: ({ row }) => {
                const status = row.original.status;
                const colorClass = status ? statusColors[status] : "bg-muted text-muted-foreground";
                return (
                    <Badge className={colorClass}>
                        {status?.toLowerCase() ?? "unknown"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <BillingActions
                    billing={row.original}
                    onView={actions.onView}
                    onRecordPayment={actions.onRecordPayment}
                    onVoid={actions.onVoid}
                />
            ),
        },
    ];
}
