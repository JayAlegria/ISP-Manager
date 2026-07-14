"use client";

import { Table } from "@tanstack/react-table";
import { Plus, RefreshCw, SlidersHorizontal } from "lucide-react";
import { TBillingWithCustomer } from "@/types/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
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
    { label: "Paid", value: "PAID" },
    { label: "Overdue", value: "OVERDUE" },
    { label: "Void", value: "VOID" },
];

const columnLabels: Record<string, string> = {
    billing_period: "Billing Period",
    customer_account_number: "Account Number",
    customer_name: "Customer Name",
    customer_plans_name: "Plan",
    amount: "Billing Amount",
    due_date: "Due Date",
    status: "Status",
};

interface BillingToolbarProps {
    table: Table<TBillingWithCustomer>;
    onRefresh: () => void;
    onGenerate: () => void;
    isRefreshing?: boolean;
}

export function BillingToolbar({ table, onRefresh, onGenerate, isRefreshing }: BillingToolbarProps) {
    console.log(table.getAllColumns())
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                <Field>
                    <Input
                        placeholder="Search billing..."
                        type="search"
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                    />
                </Field>
                <Field className="w-full">
                    <Select
                        items={statusOptions}
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
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
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <SlidersHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='w-fit'>
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

                <Button onClick={onGenerate}>
                    <Plus /> Generate Billing
                </Button>
            </div>
        </div>
    );
}
