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
import { TechnicianToolbar } from "./TechnicianToolbar"
import { TechnicianPagination } from "./TechnicianPagination"
import AddTechnicianDrawer from "./AddTechnicianDrawer"
import UpdateTechnicianDrawer from "./UpdateTechnicianDrawer"
import DeactivateTechnicianDialog from "./DeactivateTechnicianDialog"
import DeleteTechnicianDialog from "./DeleteTechnicianDialog"
import { getTechnicians } from "@/actions/technicians/get"
import { deleteTechnician } from "@/actions/technicians/delete"
import { updateTechnicianStatus } from "@/actions/technicians/update"
import { TTechnician } from "@/types/technicians"
import { TActionResponse } from "@/types/response"

interface TTechnicianTable {
    technicians: TTechnician[]
}

const globalFilterFn: FilterFn<TTechnician> = (row, _columnId, filterValue) => {
    const search = String(filterValue).toLowerCase()
    const technician = row.original

    return [technician.employee_id, technician.name, technician.email, technician.contact_number]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(search))
}

const TechnicianTable: FC<TTechnicianTable> = ({ technicians }) => {
    const [data, setData] = useState<TTechnician[]>(technicians)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false)
    const [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false)
    const [isViewMode, setIsViewMode] = useState<boolean>(false)
    const [selectedTechnician, setSelectedTechnician] = useState<TTechnician | undefined>(undefined)
    const [openDeactivateDialog, setOpenDeactivateDialog] = useState<boolean>(false)
    const [isDeactivating, setIsDeactivating] = useState<boolean>(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    useEffect(() => {
        setData(technicians)
    }, [technicians])

    const refreshTechnicians = async () => {
        setIsRefreshing(true)
        try {
            const res = await getTechnicians()
            if (res.success && res.data) {
                setData(res.data)
            } else if (!res.success) {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    const executeAction = async (action: () => Promise<TActionResponse<any>>) => {
        setIsLoading(true)
        try {
            const res = await action()
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                await refreshTechnicians()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddDrawerToggle = () => setOpenAddDrawer((prev) => !prev)

    const handleUpdateDrawerToggle = () => setOpenUpdateDrawer((prev) => !prev)

    const handleView = (technician: TTechnician) => {
        setSelectedTechnician(technician)
        setIsViewMode(true)
        setOpenUpdateDrawer(true)
    }

    const handleEdit = (technician: TTechnician) => {
        setSelectedTechnician(technician)
        setIsViewMode(false)
        setOpenUpdateDrawer(true)
    }

    const handleDeactivate = (technician: TTechnician) => {
        setSelectedTechnician(technician)
        setOpenDeactivateDialog(true)
    }

    const handleReactivate = (technician: TTechnician) =>
        executeAction(() => updateTechnicianStatus(technician.id, "active"))

    const handleDeactivateConfirm = async () => {
        if (!selectedTechnician) return

        setIsDeactivating(true)
        try {
            const res = await updateTechnicianStatus(selectedTechnician.id, "inactive")
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenDeactivateDialog(false)
                await refreshTechnicians()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsDeactivating(false)
        }
    }

    const handleDeleteRequest = (technician: TTechnician) => {
        setSelectedTechnician(technician)
        setOpenDeleteDialog(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedTechnician) return

        setIsDeleting(true)
        try {
            const res = await deleteTechnician(selectedTechnician.id)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenDeleteDialog(false)
                await refreshTechnicians()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsDeleting(false)
        }
    }

    const table = useReactTable({
        data,
        columns: getColumns({
            onView: handleView,
            onEdit: handleEdit,
            onDeactivate: handleDeactivate,
            onReactivate: handleReactivate,
            onDelete: handleDeleteRequest,
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
            <TechnicianToolbar
                table={table}
                onRefresh={refreshTechnicians}
                onAdd={handleAddDrawerToggle}
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
                                    No technicians found.
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

                <TechnicianPagination table={table} />
            </div>

            <AddTechnicianDrawer
                open={openAddDrawer}
                setOpen={handleAddDrawerToggle}
                onSuccess={refreshTechnicians}
            />

            <UpdateTechnicianDrawer
                open={openUpdateDrawer}
                setOpen={handleUpdateDrawerToggle}
                technician={selectedTechnician}
                isViewMode={isViewMode}
                setIsViewMode={setIsViewMode}
                onSuccess={refreshTechnicians}
            />

            <DeactivateTechnicianDialog
                open={openDeactivateDialog}
                setOpen={() => setOpenDeactivateDialog(false)}
                technician={selectedTechnician}
                onConfirm={handleDeactivateConfirm}
                isLoading={isDeactivating}
            />

            <DeleteTechnicianDialog
                open={openDeleteDialog}
                setOpen={() => setOpenDeleteDialog(false)}
                technician={selectedTechnician}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            />
        </div>
    )
}

export default TechnicianTable
