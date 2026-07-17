"use client"

import { FC, useEffect, useState } from "react"
import {
    ColumnFiltersState,
    FilterFn,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Skeleton } from "../ui/skeleton"
import { getColumns } from "./columns"
import { TicketToolbar } from "./TicketToolbar"
import { TicketPagination } from "./TicketPagination"
import AddTicketDrawer from "./AddTicketDrawer"
import UpdateTicketDrawer from "./UpdateTicketDrawer"
import AssignTechnicianDrawer from "./AssignTechnicianDrawer"
import ResolveTicketDrawer from "./ResolveTicketDrawer"
import TicketDetailsDrawer from "./TicketDetailsDrawer"
import ConfirmTicketActionDialog from "./ConfirmTicketActionDialog"
import { TTicketWithRelations, TTechnicianInfo } from "@/types/tickets"
import { getTickets } from "@/actions/tickets/get"
import { cancelTicket, closeTicket, updateTicketStatus } from "@/actions/tickets/update"

interface TTicketsTable {
    tickets: TTicketWithRelations[]
    technicians: TTechnicianInfo[]
    customers: Array<{ id: string; name: string; account_number: string }>
}

const globalFilterFn: FilterFn<TTicketWithRelations> = (row, _columnId, filterValue) => {
    const search = String(filterValue).toLowerCase()
    const ticket = row.original

    return [
        ticket.ticket_number,
        ticket.user?.name,
        ticket.user?.account_number,
        ticket.description,
        ticket.category,
    ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(search))
}

const TicketsTable: FC<TTicketsTable> = ({ tickets, technicians, customers }) => {
    const [data, setData] = useState<TTicketWithRelations[]>(tickets)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [openAddDrawer, setOpenAddDrawer] = useState(false)
    const [openEditDrawer, setOpenEditDrawer] = useState(false)
    const [openAssignDrawer, setOpenAssignDrawer] = useState(false)
    const [openResolveDrawer, setOpenResolveDrawer] = useState(false)
    const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false)
    const [openCloseDialog, setOpenCloseDialog] = useState(false)
    const [openCancelDialog, setOpenCancelDialog] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<TTicketWithRelations | undefined>(undefined)
    const [isConfirmingAction, setIsConfirmingAction] = useState(false)

    useEffect(() => {
        setData(tickets)
    }, [tickets])

    const refreshTickets = async () => {
        setIsRefreshing(true)
        try {
            const res = await getTickets()
            if (res.success && res.data) {
                setData(res.data)
            } else if (!res.success) {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleView = (ticket: TTicketWithRelations) => {
        setSelectedTicket(ticket)
        setOpenDetailsDrawer(true)
    }

    const handleEdit = (ticket: TTicketWithRelations) => {
        setSelectedTicket(ticket)
        setOpenEditDrawer(true)
    }

    const handleAssign = (ticket: TTicketWithRelations) => {
        setSelectedTicket(ticket)
        setOpenAssignDrawer(true)
    }

    const handleChangeStatus = async (ticket: TTicketWithRelations, newStatus: string) => {
        setIsLoading(true)
        try {
            const res = await updateTicketStatus(ticket.id, newStatus)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                await refreshTickets()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResolve = (ticket: TTicketWithRelations) => {
        setSelectedTicket(ticket)
        setOpenResolveDrawer(true)
    }

    const handleClose = (ticket: TTicketWithRelations) => {
        setSelectedTicket(ticket)
        setOpenCloseDialog(true)
    }

    const handleCancel = (ticket: TTicketWithRelations) => {
        setSelectedTicket(ticket)
        setOpenCancelDialog(true)
    }

    const handleCloseConfirm = async () => {
        if (!selectedTicket) return

        setIsConfirmingAction(true)
        try {
            const res = await closeTicket(selectedTicket.id)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenCloseDialog(false)
                await refreshTickets()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsConfirmingAction(false)
        }
    }

    const handleCancelConfirm = async () => {
        if (!selectedTicket) return

        setIsConfirmingAction(true)
        try {
            const res = await cancelTicket(selectedTicket.id)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenCancelDialog(false)
                await refreshTickets()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsConfirmingAction(false)
        }
    }

    const table = useReactTable({
        data,
        columns: getColumns({
            onView: handleView,
            onEdit: handleEdit,
            onAssign: handleAssign,
            onChangeStatus: handleChangeStatus,
            onResolve: handleResolve,
            onClose: handleClose,
            onCancel: handleCancel,
        }),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    const visibleColumnCount = table.getVisibleLeafColumns().length

    return (
        <div className="flex flex-col gap-4">
            <TicketToolbar
                table={table}
                technicians={technicians}
                onRefresh={refreshTickets}
                onAdd={() => setOpenAddDrawer(true)}
                isRefreshing={isRefreshing}
            />

            <div className="rounded-2xl border p-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {isLoading ? (
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    {table.getVisibleLeafColumns().map((column) => (
                                        <TableCell key={column.id}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={visibleColumnCount} className="h-24 text-center text-muted-foreground">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>

                <TicketPagination table={table} />
            </div>

            <AddTicketDrawer
                open={openAddDrawer}
                setOpen={() => setOpenAddDrawer(false)}
                customers={customers}
                onSuccess={refreshTickets}
            />

            <UpdateTicketDrawer
                open={openEditDrawer}
                setOpen={() => setOpenEditDrawer(false)}
                ticket={selectedTicket}
                onSuccess={refreshTickets}
            />

            <AssignTechnicianDrawer
                open={openAssignDrawer}
                setOpen={() => setOpenAssignDrawer(false)}
                ticket={selectedTicket}
                technicians={technicians}
                onSuccess={refreshTickets}
            />

            <ResolveTicketDrawer
                open={openResolveDrawer}
                setOpen={() => setOpenResolveDrawer(false)}
                ticket={selectedTicket}
                onSuccess={refreshTickets}
            />

            <TicketDetailsDrawer
                open={openDetailsDrawer}
                setOpen={() => setOpenDetailsDrawer(false)}
                ticket={selectedTicket}
            />

            <ConfirmTicketActionDialog
                open={openCloseDialog}
                setOpen={() => setOpenCloseDialog(false)}
                ticket={selectedTicket}
                title="Close ticket"
                description={`Close ticket ${selectedTicket?.ticket_number}? This will mark it as resolved and closed.`}
                confirmLabel="Close Ticket"
                isLoading={isConfirmingAction}
                onConfirm={handleCloseConfirm}
            />

            <ConfirmTicketActionDialog
                open={openCancelDialog}
                setOpen={() => setOpenCancelDialog(false)}
                ticket={selectedTicket}
                title="Cancel ticket"
                description={`Cancel ticket ${selectedTicket?.ticket_number}? This action cannot be undone.`}
                confirmLabel="Cancel Ticket"
                isLoading={isConfirmingAction}
                onConfirm={handleCancelConfirm}
            />
        </div>
    )
}

export default TicketsTable
