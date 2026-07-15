"use client"

import { FC } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { TTechnician } from "@/types/technicians"

export interface TDeleteTechnicianDialog {
    open: boolean
    setOpen: () => void
    technician?: TTechnician
    isLoading?: boolean
    onConfirm: () => void
}

const DeleteTechnicianDialog: FC<TDeleteTechnicianDialog> = ({
    open,
    setOpen,
    technician,
    isLoading,
    onConfirm,
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete technician</DialogTitle>
                    <DialogDescription>
                        This will permanently delete <strong>{technician?.name}</strong> ({technician?.employee_id}) from your records. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteTechnicianDialog
