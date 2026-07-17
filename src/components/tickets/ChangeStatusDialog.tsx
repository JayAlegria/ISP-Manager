"use client"

import { FC, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Spinner } from "../ui/spinner"
import { TTicketWithRelations } from "@/types/tickets"
import { updateTicketStatus } from "@/actions/tickets/update"
import { toast } from "sonner"
import { isValidStatusTransition } from "@/util/ticketNumber"

interface ChangeStatusDialogProps {
    open: boolean
    setOpen: () => void
    ticket?: TTicketWithRelations
    onSuccess: () => void
}

const ChangeStatusDialog: FC<ChangeStatusDialogProps> = ({ open, setOpen, ticket, onSuccess }) => {
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setSelectedStatus("")
        }
    }, [open, ticket?.id])

    if (!ticket) return null

    const getAvailableStatuses = () => {
        const allStatuses = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"]
        return allStatuses.filter((status) => isValidStatusTransition(ticket.status, status))
    }

    const handleChangeStatus = async () => {
        if (!selectedStatus) {
            toast.error("Please select a status", { position: "top-right" })
            return
        }

        setIsLoading(true)
        try {
            const res = await updateTicketStatus(ticket.id, selectedStatus)
            if (res.success) {
                toast.success(res.message, { position: "top-right" })
                setSelectedStatus("")
                onSuccess()
                setOpen()
            } else {
                toast.error(res.message, { position: "top-right" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Ticket Status</DialogTitle>
                    <DialogDescription>
                        Update status for <strong>{ticket.ticket_number}</strong> from{" "}
                        <strong>{ticket.status}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <label className="text-sm font-medium mb-2 block">New Status</label>
                    <Select
                        value={selectedStatus}
                        onValueChange={(value: string | null) => {
                            if (value) setSelectedStatus(value)
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {getAvailableStatuses().map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={setOpen} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleChangeStatus} disabled={isLoading || !selectedStatus}>
                        {isLoading ? <Spinner /> : "Change Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeStatusDialog
