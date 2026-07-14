"use client";

import { Table } from "@tanstack/react-table";
import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { TPaymentWithDetails } from "@/types/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { paymentMethodLabels } from "./columns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Pending", value: "PENDING" },
    { label: "Verified", value: "VERIFIED" },
    { label: "Rejected", value: "REJECTED" },
];

const paymentMethodOptions = [
    { label: "All methods", value: "all" },
    ...Object.entries(paymentMethodLabels).map(([value, label]) => ({ label, value })),
];

const columnLabels: Record<string, string> = {
    created_at: "Payment Date",
    account_number: "Account Number",
    name: "Customer Name",
    billing_period: "Billing Period",
    amount: "Billing Amount",
    payment_method: "Payment Method",
    reference_number: "Reference Number",
    verification_status: "Verification Status",
    flags: "Flags",
};

interface PaymentsToolbarProps {
    table: Table<TPaymentWithDetails>;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export function PaymentsToolbar({ table, onRefresh, isRefreshing }: PaymentsToolbarProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
                <Field className="md:col-span-2">
                    <Input
                        placeholder="Search by customer, account #, or reference #..."
                        type="search"
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                    />
                </Field>
                <Field>
                    <Input
                        placeholder="Billing period (YYYY-MM)"
                        value={(table.getColumn("billing_period")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("billing_period")?.setFilterValue(event.target.value || undefined)
                        }
                    />
                </Field>
                <Field className="w-full">
                    <Select
                        items={statusOptions}
                        value={(table.getColumn("verification_status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("verification_status")?.setFilterValue(value === "all" ? undefined : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {statusOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex items-center gap-2">
                <Field className="w-full">
                    <Select
                        items={paymentMethodOptions}
                        value={(table.getColumn("payment_method")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("payment_method")?.setFilterValue(value === "all" ? undefined : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {paymentMethodOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <SlidersHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {columnLabels[column.id] ?? column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="icon" aria-label="Refresh" onClick={onRefresh} disabled={isRefreshing}>
                    <RefreshCw className={isRefreshing ? "animate-spin" : undefined} />
                </Button>
            </div>
        </div>
    );
}
