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
import { BillingToolbar } from './BillingToolbar'
import { BillingPagination } from './BillingPagination'
import BillingDetailsDrawer from './BillingDetailsDrawer'
import RecordPaymentDrawer from './RecordPaymentDrawer'
import GenerateBillingDialog from './GenerateBillingDialog'
import VoidBillingDialog from './VoidBillingDialog'
import { getBilling, getBillingDetails } from '@/actions/billing/get'
import { generateMonthlyBilling } from '@/actions/billing/generate'
import { voidBilling } from '@/actions/billing/payment'
import { TBillingWithCustomer } from '@/types/billing'
import { TActionResponse } from '@/types/response'

interface TBillingTable {
    billings: TBillingWithCustomer[]
}

const globalFilterFn: FilterFn<TBillingWithCustomer> = (row, _columnId, filterValue) => {
    const search = String(filterValue).toLowerCase();
    const billing = row.original;

    return [
        billing.billing_period,
        billing.customer?.account_number,
        billing.customer?.name,
        billing.customer?.plans?.name,
        billing.status,
    ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(search));
};

const BillingTable: FC<TBillingTable> = ({ billings }) => {
    const [data, setData] = useState<TBillingWithCustomer[]>(billings)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [openDetailsDrawer, setOpenDetailsDrawer] = useState<boolean>(false)
    const [openPaymentDrawer, setOpenPaymentDrawer] = useState<boolean>(false)
    const [openGenerateDialog, setOpenGenerateDialog] = useState<boolean>(false)
    const [openVoidDialog, setOpenVoidDialog] = useState<boolean>(false)
    const [selectedBilling, setSelectedBilling] = useState<TBillingWithCustomer | undefined>(undefined)
    const [isVoiding, setIsVoiding] = useState<boolean>(false)

    useEffect(() => {
        setData(billings)
    }, [billings])

    const refreshBillings = async () => {
        setIsRefreshing(true)
        try {
            const res = await getBilling()
            if (res.success && res.data) {
                setData(res.data)
            } else if (!res.success) {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleGenerateBilling = async (billingPeriod: string) => {
        setIsGenerating(true)
        try {
            const res = await generateMonthlyBilling(billingPeriod)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenGenerateDialog(false)
                await refreshBillings()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsGenerating(false)
        }
    }

    const handleView = (billing: TBillingWithCustomer) => {
        setSelectedBilling(billing)
        setOpenDetailsDrawer(true)
    }

    const handleRecordPayment = (billing: TBillingWithCustomer) => {
        setSelectedBilling(billing)
        setOpenPaymentDrawer(true)
    }

    const handleVoid = (billing: TBillingWithCustomer) => {
        setSelectedBilling(billing)
        setOpenVoidDialog(true)
    }

    const handleVoidConfirm = async (reason: string) => {
        if (!selectedBilling) return

        setIsVoiding(true)
        try {
            const res = await voidBilling(selectedBilling.id.toString(), reason)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenVoidDialog(false)
                await refreshBillings()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsVoiding(false)
        }
    }

    const table = useReactTable({
        data,
        columns: getColumns({
            onView: handleView,
            onRecordPayment: handleRecordPayment,
            onVoid: handleVoid,
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
            <BillingToolbar
                table={table}
                onRefresh={refreshBillings}
                onGenerate={() => setOpenGenerateDialog(true)}
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
                                    No billing records found.
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

                <BillingPagination table={table} />
            </div>

            <BillingDetailsDrawer
                open={openDetailsDrawer}
                setOpen={() => setOpenDetailsDrawer(false)}
                billingId={selectedBilling?.id.toString()}
            />

            <RecordPaymentDrawer
                open={openPaymentDrawer}
                setOpen={() => setOpenPaymentDrawer(false)}
                billing={selectedBilling}
                onSuccess={refreshBillings}
            />

            <GenerateBillingDialog
                open={openGenerateDialog}
                setOpen={() => setOpenGenerateDialog(false)}
                onGenerate={handleGenerateBilling}
                isGenerating={isGenerating}
            />

            <VoidBillingDialog
                open={openVoidDialog}
                setOpen={() => setOpenVoidDialog(false)}
                billing={selectedBilling}
                onConfirm={handleVoidConfirm}
                isLoading={isVoiding}
            />
        </div>
    )
}

export default BillingTable
