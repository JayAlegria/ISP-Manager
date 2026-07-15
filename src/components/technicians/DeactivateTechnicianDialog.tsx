"use client"

import { FC } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { TTechnician } from "@/types/technicians"

export interface TDeactivateTechnicianDialog {
    open: boolean
    setOpen: () => void
    technician?: TTechnician
    isLoading?: boolean
    onConfirm: () => void
}

const DeactivateTechnicianDialog: FC<TDeactivateTechnicianDialog> = ({
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
                    <DialogTitle>Deactivate technician</DialogTitle>
                    <DialogDescription>
                        This will deactivate <strong>{technician?.name}</strong> ({technician?.employee_id}). They can be reactivated later.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Deactivate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateTechnicianDialog
