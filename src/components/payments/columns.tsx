"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TPaymentWithDetails, paymentMethodLabels } from "@/types/payments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentActions } from "./PaymentActions";

export { paymentMethodLabels };

interface PaymentColumnActions {
    onView: (payment: TPaymentWithDetails) => void;
    onVerify: (payment: TPaymentWithDetails) => void;
    onReject: (payment: TPaymentWithDetails) => void;
}

function SortableHeader({ label, column }: { label: string; column: Column<TPaymentWithDetails, unknown> }) {
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
    VERIFIED: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    REJECTED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function normalizeVerificationStatus(
    status: string | null
): "PENDING" | "VERIFIED" | "REJECTED" {
    if (status === "PENDING" || status === "REJECTED") return status;
    if (status === "VERIFIED" || status === "AUTO_VERIFIED" || status === "MANUAL_REVIEW") return "VERIFIED";
    return "PENDING";
}

export function getColumns(actions: PaymentColumnActions): ColumnDef<TPaymentWithDetails>[] {
    return [
        {
            accessorKey: "created_at",
            header: ({ column }) => <SortableHeader label="Payment Date" column={column} />,
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
        },
        {
            accessorKey: "billing.customer.account_number",
            header: "Account Number",
            cell: ({ row }) => row.original.billing?.customer?.account_number || "—",
        },
        {
            accessorKey: "billing.customer.name",
            header: ({ column }) => <SortableHeader label="Customer Name" column={column} />,
            cell: ({ row }) => row.original.billing?.customer?.name || "—",
        },
        {
            id: "billing_period",
            accessorFn: (row) => row.billing?.billing_period ?? "",
            header: ({ column }) => <SortableHeader label="Billing Period" column={column} />,
            filterFn: (row, id, value) => {
                const period = String(row.getValue(id) ?? "");
                return period.toLowerCase().includes(String(value).toLowerCase());
            },
        },
        {
            accessorKey: "billing.amount",
            header: "Billing Amount",
            cell: ({ row }) => (row.original.billing?.amount ? `₱${row.original.billing.amount}` : "—"),
        },
        {
            accessorKey: "amount",
            header: ({ column }) => <SortableHeader label="Payment Amount" column={column} />,
            cell: ({ row }) => (row.original.amount ? `₱${row.original.amount}` : "—"),
        },
        {
            accessorKey: "payment_method",
            header: "Payment Method",
            cell: ({ row }) => {
                const method = row.original.payment_method;
                return method ? paymentMethodLabels[method] ?? method : "—";
            },
        },
        {
            accessorKey: "reference_number",
            header: "Reference Number",
            cell: ({ row }) => row.original.reference_number || "—",
        },
        {
            accessorKey: "verification_status",
            header: ({ column }) => <SortableHeader label="Verification Status" column={column} />,
            filterFn: (row, id, value) => normalizeVerificationStatus(row.getValue(id)) === value,
            cell: ({ row }) => {
                const normalized = normalizeVerificationStatus(row.original.verification_status);
                return (
                    <Badge className={statusColors[normalized]}>
                        {normalized.toLowerCase()}
                    </Badge>
                );
            },
        },
        {
            id: "flags",
            header: "Flags",
            cell: ({ row }) => {
                const { isFraud, duplicate } = row.original;
                if (!isFraud && !duplicate) return <span className="text-muted-foreground">—</span>;
                return (
                    <div className="flex gap-1">
                        {isFraud && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Fraud</Badge>
                        )}
                        {duplicate && (
                            <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">Duplicate</Badge>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <PaymentActions
                    payment={row.original}
                    onView={actions.onView}
                    onVerify={actions.onVerify}
                    onReject={actions.onReject}
                />
            ),
        },
    ];
}
