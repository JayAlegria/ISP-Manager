export type TTechnician = {
    id: string;
    created_at: string;
    employee_id: string;
    name: string;
    contact_number: string;
    email: string;
    specialization: string | null;
    status: "active" | "inactive" | string | null;
};

export type TTechnicianFilter = Pick<TTechnician, "status">;
