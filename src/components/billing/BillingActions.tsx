"use client";

import { Eye, EllipsisVertical, CreditCard, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TBillingWithCustomer } from "@/types/billing";

interface BillingActionsProps {
    billing: TBillingWithCustomer;
    onView: (billing: TBillingWithCustomer) => void;
    onRecordPayment: (billing: TBillingWithCustomer) => void;
    onVoid: (billing: TBillingWithCustomer) => void;
}

export function BillingActions({ billing, onView, onRecordPayment, onVoid }: BillingActionsProps) {
    const canRecordPayment = billing.status === "PENDING" || billing.status === "OVERDUE";
    const canVoid = billing.status === "PENDING" || billing.status === "OVERDUE";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onView(billing)}>
                    <Eye />
                    View Details
                </DropdownMenuItem>

                {canRecordPayment && (
                    <DropdownMenuItem onClick={() => onRecordPayment(billing)}>
                        <CreditCard />
                        Payment
                    </DropdownMenuItem>
                )}

                {canVoid && (
                    <DropdownMenuItem className="text-red-400" onClick={() => onVoid(billing)}>
                        <Trash2 />
                        Void Bill
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
