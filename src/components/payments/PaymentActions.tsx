"use client";

import { CheckCircle2, XCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TPaymentWithDetails } from "@/types/payments";

interface PaymentActionsProps {
    payment: TPaymentWithDetails;
    onView: (payment: TPaymentWithDetails) => void;
    onVerify: (payment: TPaymentWithDetails) => void;
    onReject: (payment: TPaymentWithDetails) => void;
}

export function PaymentActions({ payment, onView, onVerify, onReject }: PaymentActionsProps) {
    const isPending = payment.verification_status === "PENDING";

    if (isPending) {
        return (
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Verify Payment"
                                className="text-green-600 hover:text-green-700"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onVerify(payment);
                                }}
                            />
                        }
                    >
                        <CheckCircle2 />
                    </TooltipTrigger>
                    <TooltipContent>Verify Payment</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Reject Payment"
                                className="text-red-400 hover:text-red-500"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onReject(payment);
                                }}
                            />
                        }
                    >
                        <XCircle />
                    </TooltipTrigger>
                    <TooltipContent>Reject Payment</TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="View Receipt"
                        onClick={(event) => {
                            event.stopPropagation();
                            onView(payment);
                        }}
                    />
                }
            >
                <Receipt />
            </TooltipTrigger>
            <TooltipContent>View Receipt</TooltipContent>
        </Tooltip>
    );
}
