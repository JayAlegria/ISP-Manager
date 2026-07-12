"use client";

import { Ban, Edit, EllipsisVertical, RotateCcw, Trash} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TPlans } from "@/types/plans";

interface PlanActionsProps {
  plan: TPlans;
  onEdit: (plan: TPlans) => void;
  onDelete: (id: string) => void;
  onEnable: (plan: TPlans) => void;
  onDisable: (plan: TPlans) => void;
}

export function PlanActions({ plan, onEdit, onDelete, onEnable, onDisable }: PlanActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
          <EllipsisVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onEdit(plan)}>
          <Edit />
          Edit
        </DropdownMenuItem>

        {plan.status === "active" ? (
          <DropdownMenuItem
            className="text-red-400"
            onClick={() => onDisable(plan)}
          >
            <Ban />
            Disable
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onEnable(plan)}>
            <RotateCcw />
            Enable
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="text-red-400"
          onClick={() => onDelete(plan.id.toString())}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}