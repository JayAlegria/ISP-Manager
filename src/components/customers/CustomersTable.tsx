"use client"
import { FC, useEffect, useState } from 'react'
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
} from "@tanstack/react-table";
import { toast } from 'sonner'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Skeleton } from '../ui/skeleton'
import { getColumns } from './columns'
import { CustomerToolbar } from './CustomerToolbar'
import { CustomerPagination } from './CustomerPagination'
import AddCustomerDrawer from './AddCustomerDrawer'
import UpdateCustomerDrawer from './UpdateCustomerDrawer'
import DeleteCustomerDialog from './DeleteCustomerDialog'
import { getCustomers } from '@/actions/users/get'
import { deleteCustomer } from '@/actions/users/delete'
import { updateCustomerStatus } from '@/actions/users/update'
import { TCustomer } from '@/types/customers'
import { TActionResponse } from '@/types/response'

interface TCustomersTable {
    customers: TCustomer[]
    planOptions: { label: string; value: string }[]
}

const globalFilterFn: FilterFn<TCustomer> = (row, _columnId, filterValue) => {
    const search = String(filterValue).toLowerCase();
    const customer = row.original;

    return [
        customer.account_number,
        customer.name,
        customer.facebook_name,
        customer.email,
        customer.contact_number,
        customer.address,
    ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(search));
};

const CustomersTable: FC<TCustomersTable> = ({ customers, planOptions }) => {
    const [data, setData] = useState<TCustomer[]>(customers)
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
    const [selectedCustomer, setSelectedCustomer] = useState<TCustomer | undefined>(undefined)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    useEffect(() => {
        setData(customers)
    }, [customers])

    const refreshCustomers = async () => {
        setIsRefreshing(true)
        try {
            const res = await getCustomers()
            if (res.success && res.data) {
                setData(res.data)
            } else if (!res.success) {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    const executeAction = async (action: () => Promise<TActionResponse>) => {
        setIsLoading(true)
        try {
            const res = await action()
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                await refreshCustomers()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddDrawerToggle = () => setOpenAddDrawer((prev) => !prev)

    const handleUpdateDrawerToggle = () => setOpenUpdateDrawer((prev) => !prev)

    const handleView = (customer: TCustomer) => {
        setSelectedCustomer(customer)
        setIsViewMode(true)
        setOpenUpdateDrawer(true)
    }

    const handleEdit = (customer: TCustomer) => {
        setSelectedCustomer(customer)
        setIsViewMode(false)
        setOpenUpdateDrawer(true)
    }

    const handleDisconnect = (customer: TCustomer) =>
        executeAction(() => updateCustomerStatus(customer.id, "inactive"))

    const handleReconnect = (customer: TCustomer) =>
        executeAction(() => updateCustomerStatus(customer.id, "active"))

    const handleDeleteRequest = (customer: TCustomer) => {
        setSelectedCustomer(customer)
        setOpenDeleteDialog(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return

        setIsDeleting(true)
        try {
            const res = await deleteCustomer(selectedCustomer.id)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenDeleteDialog(false)
                await refreshCustomers()
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
            onDisconnect: handleDisconnect,
            onReconnect: handleReconnect,
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
    });

    const visibleColumnCount = table.getVisibleLeafColumns().length

    return (
        <div className="flex flex-col gap-4">
            <CustomerToolbar
                table={table}
                planOptions={planOptions}
                onRefresh={refreshCustomers}
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
                                    No customers found.
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

                <CustomerPagination table={table} />
            </div>

            <AddCustomerDrawer
                open={openAddDrawer}
                setOpen={handleAddDrawerToggle}
                planOptions={planOptions}
                onSuccess={refreshCustomers}
            />

            <UpdateCustomerDrawer
                open={openUpdateDrawer}
                setOpen={handleUpdateDrawerToggle}
                customer={selectedCustomer}
                planOptions={planOptions}
                readOnly={isViewMode}
                onSuccess={refreshCustomers}
            />

            <DeleteCustomerDialog
                open={openDeleteDialog}
                setOpen={() => setOpenDeleteDialog(false)}
                customer={selectedCustomer}
                isLoading={isDeleting}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

export default CustomersTable
