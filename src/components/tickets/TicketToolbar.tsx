"use client"

import { RefreshCw, Plus, SlidersHorizontal } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { TTicketWithRelations } from "@/types/tickets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ALL_VALUE = "all"

const statusOptions = [
    { label: "All Status", value: ALL_VALUE },
    { label: "Open", value: "OPEN" },
    { label: "Assigned", value: "ASSIGNED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved", value: "RESOLVED" },
    { label: "Closed", value: "CLOSED" },
    { label: "Cancelled", value: "CANCELLED" },
]

const categoryOptions = [
    { label: "All Categories", value: ALL_VALUE },
    { label: "Internet Problem", value: "internet_problem" },
    { label: "Billing Problem", value: "billing_problem" },
    { label: "Relocation", value: "relocation" },
    { label: "Installation", value: "installation" },
]

const columnLabels: Record<string, string> = {
    ticket_number: "Ticket #",
    user_name: "Customer",
    category: "Category",
    technician_name: "Technician",
    status: "Status",
    created_at: "Created",
}

interface TicketToolbarProps {
    table: Table<TTicketWithRelations>
    technicians: Array<{ id: string; name: string }>
    onRefresh: () => void
    onAdd: () => void
    isRefreshing?: boolean
}

export function TicketToolbar({ table, technicians, onRefresh, onAdd, isRefreshing }: TicketToolbarProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Field className="flex-1">
                <Input
                    placeholder="Search tickets..."
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                />
            </Field>

            <div className="flex items-center gap-2 flex-wrap">
                <Select
                    items={statusOptions}
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? ALL_VALUE}
                    onValueChange={(value) =>
                        table.getColumn("status")?.setFilterValue(value === ALL_VALUE ? undefined : value)
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select
                    items={categoryOptions}
                    value={(table.getColumn("category")?.getFilterValue() as string) ?? ALL_VALUE}
                    onValueChange={(value) =>
                        table.getColumn("category")?.setFilterValue(value === ALL_VALUE ? undefined : value)
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {categoryOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Toggle columns" />}>
                        <SlidersHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-fit">
                        {table
                            .getAllLeafColumns()
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

                <Button
                    variant="outline"
                    size="icon"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    aria-label="Refresh"
                >
                    <RefreshCw className={isRefreshing ? "animate-spin" : undefined} />
                </Button>

                <Button size="sm" onClick={onAdd}>
                    <Plus />
                    Create Ticket
                </Button>
            </div>
        </div>
    )
}
