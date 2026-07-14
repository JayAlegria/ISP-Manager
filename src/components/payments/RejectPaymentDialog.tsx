"use client"
import { FC } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { TPaymentWithDetails } from '@/types/payments'

export interface TRejectPaymentDialog {
    open: boolean
    setOpen: () => void
    payment?: TPaymentWithDetails
    isLoading?: boolean
    onConfirm: () => void
}

const RejectPaymentDialog: FC<TRejectPaymentDialog> = ({ open, setOpen, payment, isLoading, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject payment</DialogTitle>
                    <DialogDescription>
                        Reject the payment of <strong>₱{payment?.amount}</strong> from{" "}
                        <strong>{payment?.billing?.customer?.name}</strong> ({payment?.billing?.customer?.account_number}).
                        The billing record will remain unchanged and the customer may submit another payment.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Reject Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RejectPaymentDialog
