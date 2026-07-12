"use client"
import { FC } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { TCustomer } from '@/types/customers'

export interface TDeleteCustomerDialog {
    open: boolean
    setOpen: () => void
    customer?: TCustomer
    isLoading?: boolean
    onConfirm: () => void
}

const DeleteCustomerDialog: FC<TDeleteCustomerDialog> = ({ open, setOpen, customer, isLoading, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete customer</DialogTitle>
                    <DialogDescription>
                        This will permanently delete <strong>{customer?.name}</strong> ({customer?.account_number}) from your records. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCustomerDialog
