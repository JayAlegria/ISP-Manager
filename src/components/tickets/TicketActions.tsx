"use client"

import { Eye, Pencil, UserCheck, PlayCircle, CheckCircle, Lock, XCircle, EllipsisVertical } from "lucide-react"
import { TTicketWithRelations } from "@/types/tickets"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TicketActionsProps {
    ticket: TTicketWithRelations
    onView: (ticket: TTicketWithRelations) => void
    onEdit: (ticket: TTicketWithRelations) => void
    onAssign: (ticket: TTicketWithRelations) => void
    onChangeStatus: (ticket: TTicketWithRelations, status: string) => void | Promise<void>
    onResolve: (ticket: TTicketWithRelations) => void
    onClose: (ticket: TTicketWithRelations) => void
    onCancel: (ticket: TTicketWithRelations) => void
}

export function TicketActions({
    ticket,
    onView,
    onEdit,
    onAssign,
    onChangeStatus,
    onResolve,
    onClose,
    onCancel,
}: TicketActionsProps) {
    const canClose = ticket.status === "RESOLVED"
    const canCancel = ticket.status !== "CLOSED" && ticket.status !== "CANCELLED"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onView(ticket)}>
                    <Eye />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(ticket)}>
                    <Pencil />
                    Edit
                </DropdownMenuItem>

                {ticket.status === "OPEN" && (
                    <DropdownMenuItem onClick={() => onAssign(ticket)}>
                        <UserCheck />
                        Assign Technician
                    </DropdownMenuItem>
                )}
                {ticket.status === "ASSIGNED" && (
                    <DropdownMenuItem onClick={() => onChangeStatus(ticket, "IN_PROGRESS")}>
                        <PlayCircle />
                        In Progress
                    </DropdownMenuItem>
                )}
                {ticket.status === "IN_PROGRESS" && (
                    <DropdownMenuItem onClick={() => onResolve(ticket)}>
                        <CheckCircle />
                        Resolve
                    </DropdownMenuItem>
                )}

                {canClose && (
                    <DropdownMenuItem onClick={() => onClose(ticket)}>
                        <Lock />
                        Close
                    </DropdownMenuItem>
                )}
                {canCancel && (
                    <DropdownMenuItem className="text-red-400" onClick={() => onCancel(ticket)}>
                        <XCircle />
                        Cancel
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
