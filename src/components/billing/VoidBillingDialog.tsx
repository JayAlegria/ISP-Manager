"use client"
import { FC, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { TBillingWithCustomer } from '@/types/billing'

export interface TVoidBillingDialog {
    open: boolean
    setOpen: () => void
    billing?: TBillingWithCustomer
    isLoading?: boolean
    onConfirm: (reason: string) => void
}

const VoidBillingDialog: FC<TVoidBillingDialog> = ({ open, setOpen, billing, isLoading, onConfirm }) => {
    const [reason, setReason] = useState('')

    const handleConfirm = () => {
        if (!reason.trim()) {
            return
        }
        onConfirm(reason)
        setReason('')
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setReason('')
        }
        setOpen()
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Void billing record</DialogTitle>
                    <DialogDescription>
                        Void billing for <strong>{billing?.customer?.name}</strong> ({billing?.customer?.account_number}) - {billing?.billing_period}. Please provide a reason.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <textarea
                        placeholder="Enter reason for voiding this bill..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={isLoading}
                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={isLoading || !reason.trim()}>
                        {isLoading ? <Spinner /> : "Void"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default VoidBillingDialog
