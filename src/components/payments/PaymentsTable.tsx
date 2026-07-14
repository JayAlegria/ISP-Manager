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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Skeleton } from '../ui/skeleton'
import { getColumns } from './columns'
import { PaymentsToolbar } from './PaymentsToolbar'
import { PaymentsPagination } from './PaymentsPagination'
import PaymentDetailsDrawer from './PaymentDetailsDrawer'
import VerifyPaymentDialog from './VerifyPaymentDialog'
import RejectPaymentDialog from './RejectPaymentDialog'
import { getPayments } from '@/actions/payments/get'
import { verifyPayment } from '@/actions/payments/verify'
import { rejectPayment } from '@/actions/payments/reject'
import { TPaymentWithDetails } from '@/types/payments'

interface TPaymentsTable {
    payments: TPaymentWithDetails[]
}

const globalFilterFn: FilterFn<TPaymentWithDetails> = (row, _columnId, filterValue) => {
    const search = String(filterValue).toLowerCase();
    const payment = row.original;

    return [
        payment.billing?.customer?.account_number,
        payment.billing?.customer?.name,
        payment.reference_number,
    ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(search));
};

const PaymentsTable: FC<TPaymentsTable> = ({ payments }) => {
    const [data, setData] = useState<TPaymentWithDetails[]>(payments)
    const [isLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [openDetailsDrawer, setOpenDetailsDrawer] = useState<boolean>(false)
    const [openVerifyDialog, setOpenVerifyDialog] = useState<boolean>(false)
    const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false)
    const [selectedPayment, setSelectedPayment] = useState<TPaymentWithDetails | undefined>(undefined)
    const [isVerifying, setIsVerifying] = useState<boolean>(false)
    const [isRejecting, setIsRejecting] = useState<boolean>(false)

    useEffect(() => {
        setData(payments)
    }, [payments])

    const refreshPayments = async () => {
        setIsRefreshing(true)
        try {
            const res = await getPayments()
            if (res.success && res.data) {
                setData(res.data)
            } else if (!res.success) {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleView = (payment: TPaymentWithDetails) => {
        setSelectedPayment(payment)
        setOpenDetailsDrawer(true)
    }

    const handleVerify = (payment: TPaymentWithDetails) => {
        setSelectedPayment(payment)
        setOpenDetailsDrawer(false)
        setOpenVerifyDialog(true)
    }

    const handleReject = (payment: TPaymentWithDetails) => {
        setSelectedPayment(payment)
        setOpenDetailsDrawer(false)
        setOpenRejectDialog(true)
    }

    const handleVerifyConfirm = async () => {
        if (!selectedPayment) return

        setIsVerifying(true)
        try {
            const res = await verifyPayment(selectedPayment.id.toString())
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenVerifyDialog(false)
                await refreshPayments()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsVerifying(false)
        }
    }

    const handleRejectConfirm = async () => {
        if (!selectedPayment) return

        setIsRejecting(true)
        try {
            const res = await rejectPayment(selectedPayment.id.toString())
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setOpenRejectDialog(false)
                await refreshPayments()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsRejecting(false)
        }
    }

    const table = useReactTable({
        data,
        columns: getColumns({
            onView: handleView,
            onVerify: handleVerify,
            onReject: handleReject,
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
            <PaymentsToolbar
                table={table}
                onRefresh={refreshPayments}
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
                                    No payment records found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className="cursor-pointer"
                                    onClick={() => handleView(row.original)}
                                >
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

                <PaymentsPagination table={table} />
            </div>

            <PaymentDetailsDrawer
                open={openDetailsDrawer}
                setOpen={() => setOpenDetailsDrawer(false)}
                paymentId={selectedPayment?.id.toString()}
                onVerify={handleVerify}
                onReject={handleReject}
            />

            <VerifyPaymentDialog
                open={openVerifyDialog}
                setOpen={() => setOpenVerifyDialog(false)}
                payment={selectedPayment}
                onConfirm={handleVerifyConfirm}
                isLoading={isVerifying}
            />

            <RejectPaymentDialog
                open={openRejectDialog}
                setOpen={() => setOpenRejectDialog(false)}
                payment={selectedPayment}
                onConfirm={handleRejectConfirm}
                isLoading={isRejecting}
            />
        </div>
    )
}

export default PaymentsTable
