"use client"

import { Eye, Pencil, Trash2, UserX, UserCheck, EllipsisVertical } from "lucide-react"
import { TTechnician } from "@/types/technicians"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TechnicianActionsProps {
    technician: TTechnician
    onView: (technician: TTechnician) => void
    onEdit: (technician: TTechnician) => void
    onDeactivate: (technician: TTechnician) => void
    onReactivate: (technician: TTechnician) => void
    onDelete: (technician: TTechnician) => void
}

export function TechnicianActions({
    technician,
    onView,
    onEdit,
    onDeactivate,
    onReactivate,
    onDelete,
}: TechnicianActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onView(technician)}>
                    <Eye />
                    View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(technician)}>
                    <Pencil />
                    Edit
                </DropdownMenuItem>
                {technician.status === "active" ? (
                    <DropdownMenuItem className="text-red-400" onClick={() => onDeactivate(technician)}>
                        <UserX />
                        Deactivate
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => onReactivate(technician)}>
                        <UserCheck />
                        Reactivate
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-400" onClick={() => onDelete(technician)}>
                    <Trash2 />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
