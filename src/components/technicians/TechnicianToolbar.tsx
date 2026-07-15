"use client"

import { RefreshCw, Plus, SlidersHorizontal } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { TTechnician } from "@/types/technicians"
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

const columnLabel: Record<string, string> = {
    name: "Name",
    employee_id: "Employee Id",
    email: "Email",
    contact_number: "Contact Number",
    specialization: "Specialization",
    status: "Status"
}

interface TechnicianToolbarProps {
    table: Table<TTechnician>
    onRefresh: () => void
    onAdd: () => void
    isRefreshing?: boolean
}

export function TechnicianToolbar({ table, onRefresh, onAdd, isRefreshing }: TechnicianToolbarProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Field className="flex-1">
                <Input
                    placeholder="Search technicians..."
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                />
            </Field>

            <div className="flex items-center gap-2">
                <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? ALL_VALUE}
                    onValueChange={(value) =>
                        table.getColumn("status")?.setFilterValue(value === ALL_VALUE ? undefined : value)
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={ALL_VALUE}>All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                                    {columnLabel[column.id] || column.id}
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
                    Add Technician
                </Button>
            </div>
        </div>
    )
}
