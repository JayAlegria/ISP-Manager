"use client"
import { FC } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { TTicketWithRelations } from '@/types/tickets'

export interface TConfirmTicketActionDialog {
    open: boolean
    setOpen: () => void
    ticket?: TTicketWithRelations
    title: string
    description: string
    confirmLabel: string
    isLoading?: boolean
    onConfirm: () => void
}

const ConfirmTicketActionDialog: FC<TConfirmTicketActionDialog> = ({
    open,
    setOpen,
    title,
    description,
    confirmLabel,
    isLoading,
    onConfirm,
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Spinner /> : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmTicketActionDialog
