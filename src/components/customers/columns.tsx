"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TCustomer } from "@/types/customers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerActions } from "./CustomerActions";

interface CustomerColumnActions {
    onView: (customer: TCustomer) => void;
    onEdit: (customer: TCustomer) => void;
    onDisconnect: (customer: TCustomer) => void;
    onReconnect: (customer: TCustomer) => void;
    onDelete: (customer: TCustomer) => void;
}

function SortableHeader({ label, column }: { label: string; column: Column<TCustomer, unknown> }) {
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

export function getColumns(actions: CustomerColumnActions): ColumnDef<TCustomer>[] {
    return [
        {
            accessorKey: "account_number",
            header: ({ column }) => <SortableHeader label="Account Number" column={column} />,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <SortableHeader label="Customer Name" column={column} />,
            cell: ({ row }) => row.original.name || "—",
        },
        {
            accessorKey: "facebook_name",
            header: "Facebook Name",
        },
        {
            accessorKey: "contact_number",
            header: "Contact Number",
            cell: ({ row }) => row.original.contact_number || "—",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || "—",
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <span className="block max-w-50 truncate" title={row.original.address ?? undefined}>
                    {row.original.address || "—"}
                </span>
            ),
        },
        {
            accessorKey: "plan",
            header: "Plan",
            cell: ({ row }) => row.original.plans?.name ?? "Unassigned",
            filterFn: (row, columnId, filterValue) => row.original.plan === filterValue,
        },
        {
            accessorKey: "billing_day",
            header: ({ column }) => <SortableHeader label="Billing Day" column={column} />,
            cell: ({ row }) => row.original.billing_day ?? "—",
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader label="Status" column={column} />,
            cell: ({ row }) => {
                const status = row.original.status?.toLowerCase();

                return (
                    <Badge
                        className={
                            status === "active"
                                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : status === "inactive"
                                    ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                    : "bg-muted text-muted-foreground"
                        }
                    >
                        {status ?? "unknown"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <CustomerActions
                    customer={row.original}
                    onView={actions.onView}
                    onEdit={actions.onEdit}
                    onDisconnect={actions.onDisconnect}
                    onReconnect={actions.onReconnect}
                    onDelete={actions.onDelete}
                />
            ),
        },
    ];
}
