"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TPlans } from "@/types/plans";
import { Badge } from "@/components/ui/badge";
import { PlanActions } from "./PlanActions";

interface PlanColumnActions {
    onEdit: (plan: TPlans) => void;
    onDelete: (id: string) => void;
    onEnable: (plan: TPlans) => void;
    onDisable: (plan: TPlans) => void;
}

export function getColumns(actions: PlanColumnActions): ColumnDef<TPlans>[] {
    return [
        {
            accessorKey: "name",
            header: "Plan Name",
        },
        {
            accessorKey: "speed",
            header: "Speed",
            cell: ({ row }) => `${row.original.speed} Mbps`,
        },
        {
            accessorKey: "monthly_fee",
            header: "Monthly",
            cell: ({ row }) => `₱${row.original.monthly_fee}`,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status?.toLowerCase();

                return (
                    <Badge
                        className={
                            status === "active"
                                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }
                    >
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <PlanActions
                    plan={row.original}
                    onEdit={actions.onEdit}
                    onDelete={actions.onDelete}
                    onEnable={actions.onEnable}
                    onDisable={actions.onDisable}
                />
            ),
        }
    ]
};