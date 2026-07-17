"use client"

import { FC } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { TTicketWithRelations } from "@/types/tickets"

interface TicketDetailsDrawerProps {
    open: boolean
    setOpen: () => void
    ticket?: TTicketWithRelations
}

const TicketDetailsDrawer: FC<TicketDetailsDrawerProps> = ({ open, setOpen, ticket }) => {
    if (!ticket) return null

    const categoryColors: Record<string, string> = {
        internet_problem: "bg-indigo-50 text-indigo-700",
        billing_problem: "bg-cyan-50 text-cyan-700",
        relocation: "bg-orange-50 text-orange-700",
        installation: "bg-teal-50 text-teal-700",
    }

    const statusColors: Record<string, string> = {
        OPEN: "bg-blue-50 text-blue-700",
        ASSIGNED: "bg-yellow-50 text-yellow-700",
        IN_PROGRESS: "bg-purple-50 text-purple-700",
        RESOLVED: "bg-green-50 text-green-700",
        CLOSED: "bg-gray-50 text-gray-700",
        CANCELLED: "bg-red-50 text-red-700",
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Ticket Details</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-6">
                    {/* Ticket Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Ticket Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Ticket Number:</span>
                                <span className="font-medium">{ticket.ticket_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge className={statusColors[ticket.status] || "bg-gray-50 text-gray-700"}>
                                    {ticket.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Category:</span>
                                <Badge className={categoryColors[ticket.category] || "bg-gray-50 text-gray-700"}>
                                    {ticket.category.replace(/_/g, " ")}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{formatDate(ticket.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Customer Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name:</span>
                                <span>{ticket.user?.name || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Account Number:</span>
                                <span>{ticket.user?.account_number || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Contact Number:</span>
                                <span>{ticket.user?.contact_number || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Address:</span>
                                <span className="text-right">{ticket.user?.address || "—"}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold mb-3">Description</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    {/* Assignment */}
                    {ticket.technician && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Assignment</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Technician:</span>
                                        <span>{ticket.technician.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Employee ID:</span>
                                        <span>{ticket.technician.employee_id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Assigned At:</span>
                                        <span>{formatDate(ticket.assigned_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Resolution */}
                    {ticket.resolved_at && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Resolution</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Resolved At:</span>
                                        <span>{formatDate(ticket.resolved_at)}</span>
                                    </div>
                                    {ticket.resolution_notes && (
                                        <div>
                                            <p className="text-muted-foreground mb-1">Notes:</p>
                                            <p className="whitespace-pre-wrap">{ticket.resolution_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Closure */}
                    {ticket.closed_at && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Closure</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Closed At:</span>
                                        <span>{formatDate(ticket.closed_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default TicketDetailsDrawer
