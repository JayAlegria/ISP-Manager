export type TCustomerPlan = {
    id: string;
    name: string;
};

export type TCustomer = {
    id: string;
    created_at: string;
    account_number: string;
    name: string | null;
    facebook_name: string;
    contact_number: string | null;
    email: string | null;
    address: string | null;
    billing_day: number | null;
    status: "active" | "inactive" | string | null;
    plan: string | null;
    plans: TCustomerPlan | null;
};

export type TCustomerFilter = Pick<TCustomer, "status">;
