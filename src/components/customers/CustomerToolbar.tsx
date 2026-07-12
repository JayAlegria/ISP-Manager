"use client";

import { Table } from "@tanstack/react-table";
import { Plus, RefreshCw, SlidersHorizontal } from "lucide-react";
import { TCustomer } from "@/types/customers";
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

const ALL_VALUE = "all";

const statusOptions = [
    { label: "All status", value: ALL_VALUE },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

const columnLabels: Record<string, string> = {
    account_number: "Account Number",
    name: "Customer Name",
    facebook_name: "Facebook Name",
    contact_number: "Contact Number",
    email: "Email",
    address: "Address",
    plan: "Plan",
    billing_day: "Billing Day",
    status: "Status",
};

interface CustomerToolbarProps {
    table: Table<TCustomer>;
    planOptions: { label: string; value: string }[];
    onRefresh: () => void;
    onAdd: () => void;
    isRefreshing?: boolean;
}

export function CustomerToolbar({ table, planOptions, onRefresh, onAdd, isRefreshing }: CustomerToolbarProps) {
    const planFilterOptions = [{ label: "All plans", value: ALL_VALUE }, ...planOptions];

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                <Field>
                    <Input
                        placeholder="Search customers..."
                        type="search"
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                    />
                </Field>
                <Field className="w-full">
                    <Select
                        items={statusOptions}
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? ALL_VALUE}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === ALL_VALUE ? undefined : value)
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
                <Field className="w-full">
                    <Select
                        items={planFilterOptions}
                        value={(table.getColumn("plan")?.getFilterValue() as string) ?? ALL_VALUE}
                        onValueChange={(value) =>
                            table.getColumn("plan")?.setFilterValue(value === ALL_VALUE ? undefined : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {planFilterOptions.map((item) => (
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
                    <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Toggle columns" />}>
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

                <Button onClick={onAdd}>
                    <Plus /> Add Customer
                </Button>
            </div>
        </div>
    );
}
