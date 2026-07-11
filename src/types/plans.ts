export type TPlans = {
   name: string;
    id: bigint;
    created_at: Date;
    monthly_fee: string;
    plan_id: string;
    status: "active" | "inactive" | string;
    speed: number;
}