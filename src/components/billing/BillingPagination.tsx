"use client";

import { Table } from "@tanstack/react-table";
import { TBillingWithCustomer } from "@/types/billing";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const pageSizeOptions = [10, 20, 30, 50];

interface BillingPaginationProps {
    table: Table<TBillingWithCustomer>;
}

export function BillingPagination({ table }: BillingPaginationProps) {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;
    const totalCount = table.getFilteredRowModel().rows.length;

    return (
        <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-end">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Rows per page</p>
                    <Select
                        items={pageSizeOptions.map((size) => ({ label: size.toString(), value: size.toString() }))}
                        value={pageSize.toString()}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
                </p>

                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    table.previousPage();
                                }}
                                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    table.nextPage();
                                }}
                                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
