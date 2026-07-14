"use client"
import { FC, useEffect, useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { getBillingDetails } from '@/actions/billing/get'
import { TBillingWithCustomer } from '@/types/billing'

export interface TBillingDetailsDrawer {
    open: boolean
    setOpen: () => void
    billingId?: string
}

function DetailRowSkeleton() {
    return (
        <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
        </div>
    )
}

function BillingDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => <DetailRowSkeleton key={i} />)}
                </div>
            </div>

            <Separator />

            <div>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => <DetailRowSkeleton key={i} />)}
                </div>
            </div>
        </div>
    )
}

const BillingDetailsDrawer: FC<TBillingDetailsDrawer> = ({ open, setOpen, billingId }) => {
    const [billing, setBilling] = useState<TBillingWithCustomer & { payment?: any } | null>(null)

    useEffect(() => {
        if (!open || !billingId) return

        setBilling(null)

        const loadDetails = async () => {
            const res = await getBillingDetails(billingId)
            if (res.success && res.data) {
                setBilling(res.data as any)
            }
        }

        loadDetails()
    }, [open, billingId])

    return (
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
            <DrawerContent>
                <DrawerHeader className="py-5">
                    <DrawerTitle className="font-bold">Billing Details</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    {!billing ? (
                        <BillingDetailsSkeleton />
                    ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Customer Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Account Number:</span>
                                    <span>{billing.customer?.account_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer Name:</span>
                                    <span>{billing.customer?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span>{billing.customer?.address || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Contact Number:</span>
                                    <span>{billing.customer?.contact_number || "—"}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Billing Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Period:</span>
                                    <span>{billing.billing_period}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Plan:</span>
                                    <span>{billing.customer?.plans?.name || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Date:</span>
                                    <span>{new Date(billing.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Due Date:</span>
                                    <span>{billing.due_date ? new Date(billing.due_date).toLocaleDateString() : "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Amount:</span>
                                    <span className="font-semibold">₱{billing.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-semibold uppercase">{billing.status}</span>
                                </div>
                                {billing.status === "VOID" && billing.void_reason && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Void Reason:</span>
                                        <span className="text-sm">{billing.void_reason}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {billing.payment && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-3">Payment Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment Date:</span>
                                            <span>{new Date(billing.payment.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Reference Number:</span>
                                            <span>{billing.payment.reference_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Verification Status:</span>
                                            <span>{billing.payment.verification_status}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    )}
                </div>
                <div className="border-t p-4">
                    <Button className="w-full" onClick={setOpen}>Close</Button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default BillingDetailsDrawer
