export type TBillingStatus = "PENDING" | "PAID" | "OVERDUE" | "VOID";

export type TBilling = {
    id: string;
    created_at: string;
    customer_id: string | null;
    billing_period: string | null;
    due_date: string | null;
    amount: string | null;
    status: TBillingStatus | null;
    void_reason: string | null;
};

export type TBillingWithCustomer = TBilling & {
    customer?: {
        id: string;
        account_number: string;
        name: string | null;
        facebook_name: string;
        contact_number: string | null;
        address: string | null;
        email: string | null;
        billing_day: number | null;
        status: string | null;
        plans: {
            id: string;
            name: string;
        } | null;
    };
};

export type TPayment = {
    id: string;
    created_at: string;
    reference_number: string | null;
    user_id: string | null;
    billing_id: string | null;
    verified: boolean | null;
    verified_at: string | null;
    verification_status: string | null;
    isFraud: boolean | null;
    duplicate: boolean | null;
};

export type TBillingReminder = {
    id: string;
    created_at: string;
    billing_id: string;
    reminder_type: string;
    sent_at: string;
};
