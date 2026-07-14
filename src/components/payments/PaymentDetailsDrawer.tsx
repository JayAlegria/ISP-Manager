"use client"
import { FC, useEffect, useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { getPaymentDetails } from '@/actions/payments/get'
import { TPaymentWithDetails } from '@/types/payments'
import { normalizeVerificationStatus, paymentMethodLabels } from './columns'

export interface TPaymentDetailsDrawer {
    open: boolean
    setOpen: () => void
    paymentId?: string
    onVerify: (payment: TPaymentWithDetails) => void
    onReject: (payment: TPaymentWithDetails) => void
}

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    VERIFIED: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    REJECTED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function DetailRowSkeleton() {
    return (
        <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
        </div>
    )
}

function PaymentDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => <DetailRowSkeleton key={i} />)}
                </div>
            </div>

            <Separator />

            <div>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => <DetailRowSkeleton key={i} />)}
                </div>
            </div>

            <Separator />

            <div>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => <DetailRowSkeleton key={i} />)}
                </div>
                <Skeleton className="h-40 w-full mt-4 rounded-lg" />
            </div>
        </div>
    )
}

const PaymentDetailsDrawer: FC<TPaymentDetailsDrawer> = ({ open, setOpen, paymentId, onVerify, onReject }) => {
    const [payment, setPayment] = useState<TPaymentWithDetails | null>(null)

    useEffect(() => {
        if (!open || !paymentId) return

        setPayment(null)

        const loadDetails = async () => {
            const res = await getPaymentDetails(paymentId)
            if (res.success && res.data) {
                setPayment(res.data)
            }
        }

        loadDetails()
    }, [open, paymentId])

    return (
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
            <DrawerContent>
                <DrawerHeader className="py-5">
                    <DrawerTitle className="font-bold">Payment Details</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    {!payment ? (
                        <PaymentDetailsSkeleton />
                    ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Customer Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Account Number:</span>
                                    <span>{payment.billing?.customer?.account_number || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer Name:</span>
                                    <span>{payment.billing?.customer?.name || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Contact Number:</span>
                                    <span>{payment.billing?.customer?.contact_number || "—"}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Billing Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Period:</span>
                                    <span>{payment.billing?.billing_period || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Plan:</span>
                                    <span>{payment.billing?.customer?.plans?.name || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Amount:</span>
                                    <span className="font-semibold">₱{payment.billing?.amount || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Due Date:</span>
                                    <span>{payment.billing?.due_date ? new Date(payment.billing.due_date).toLocaleDateString() : "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Status:</span>
                                    <span className="font-semibold uppercase">{payment.billing?.status || "—"}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Payment Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Date:</span>
                                    <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Amount:</span>
                                    <span className="font-semibold">₱{payment.amount || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Method:</span>
                                    <span>{payment.payment_method ? paymentMethodLabels[payment.payment_method] ?? payment.payment_method : "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reference Number:</span>
                                    <span>{payment.reference_number || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Verification Status:</span>
                                    <Badge className={statusColors[normalizeVerificationStatus(payment.verification_status)]}>
                                        {normalizeVerificationStatus(payment.verification_status).toLowerCase()}
                                    </Badge>
                                </div>
                                {(payment.isFraud || payment.duplicate) && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Flags:</span>
                                        <div className="flex gap-1">
                                            {payment.isFraud && (
                                                <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Fraud</Badge>
                                            )}
                                            {payment.duplicate && (
                                                <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">Duplicate</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {payment.verified_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Verified Date:</span>
                                        <span>{new Date(payment.verified_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {payment.receipt_url && (
                                    <div className="pt-2">
                                        <p className="text-muted-foreground mb-2">Receipt Image:</p>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={payment.receipt_url}
                                            alt="Payment receipt"
                                            className="w-full rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                <div className="border-t p-4 flex gap-2">
                    {payment?.verification_status === "PENDING" && (
                        <>
                            <Button variant="destructive" className="flex-1" onClick={() => onReject(payment)}>
                                Reject
                            </Button>
                            <Button className="flex-1" onClick={() => onVerify(payment)}>
                                Verify
                            </Button>
                        </>
                    )}
                    <Button variant={payment?.verification_status === "PENDING" ? "outline" : "default"} className="flex-1" onClick={setOpen}>
                        Close
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default PaymentDetailsDrawer
