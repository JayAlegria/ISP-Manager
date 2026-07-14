export type TPaymentVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export const paymentMethodLabels: Record<string, string> = {
    CASH: "Cash",
    GCASH: "GCash",
    BANK_TRANSFER: "Bank Transfer",
    CHECK: "Check",
    OTHER: "Other",
};

export type TPaymentWithDetails = {
    id: string;
    created_at: string;
    reference_number: string | null;
    amount: string | null;
    payment_method: string | null;
    receipt_url: string | null;
    verification_status: string | null;
    verified: boolean | null;
    verified_at: string | null;
    verified_by: string | null;
    isFraud: boolean | null;
    duplicate: boolean | null;
    billing_id: string | null;
    billing?: {
        id: string;
        billing_period: string | null;
        due_date: string | null;
        amount: string | null;
        status: string | null;
        customer?: {
            id: string;
            account_number: string;
            name: string | null;
            contact_number: string | null;
            plans: {
                id: string;
                name: string;
            } | null;
        };
    };
};
