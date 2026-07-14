"use client"
import { FC } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { TPaymentWithDetails } from '@/types/payments'

export interface TVerifyPaymentDialog {
    open: boolean
    setOpen: () => void
    payment?: TPaymentWithDetails
    isLoading?: boolean
    onConfirm: () => void
}

const VerifyPaymentDialog: FC<TVerifyPaymentDialog> = ({ open, setOpen, payment, isLoading, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify payment</DialogTitle>
                    <DialogDescription>
                        Verify the payment of <strong>₱{payment?.amount}</strong> from{" "}
                        <strong>{payment?.billing?.customer?.name}</strong> ({payment?.billing?.customer?.account_number})
                        for billing period {payment?.billing?.billing_period}. This will mark the billing record as PAID.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>Cancel</Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Verify Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default VerifyPaymentDialog
