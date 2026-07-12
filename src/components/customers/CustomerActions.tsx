"use client";

import { Ban, Edit, Eye, EllipsisVertical, RotateCcw, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TCustomer } from "@/types/customers";

interface CustomerActionsProps {
  customer: TCustomer;
  onView: (customer: TCustomer) => void;
  onEdit: (customer: TCustomer) => void;
  onDisconnect: (customer: TCustomer) => void;
  onReconnect: (customer: TCustomer) => void;
  onDelete: (customer: TCustomer) => void;
}

export function CustomerActions({ customer, onView, onEdit, onDisconnect, onReconnect, onDelete }: CustomerActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="size-4"/>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onView(customer)}>
          <Eye />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit(customer)}>
          <Edit />
          Edit
        </DropdownMenuItem>

        {customer.status === "active" ? (
          <DropdownMenuItem
            className="text-red-400"
            onClick={() => onDisconnect(customer)}
          >
            <Ban />
            Disconnect
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onReconnect(customer)}>
            <RotateCcw />
            Reconnect
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="text-red-400"
          onClick={() => onDelete(customer)}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
