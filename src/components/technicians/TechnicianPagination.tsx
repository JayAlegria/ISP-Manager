"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { TTechnician } from "@/types/technicians"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const pageSizeOptions = [5, 10, 15, 20, 25, 30]

interface TechnicianPaginationProps {
    table: Table<TTechnician>
}

export function TechnicianPagination({ table }: TechnicianPaginationProps) {
    const { pageIndex, pageSize } = table.getState().pagination
    const pageCount = table.getPageCount()

    return (
        <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-end">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Rows per page</p>
                    <Select
                        items={pageSizeOptions.map((size) => ({ label: size.toString(), value: size.toString() }))}
                        value={pageSize.toString()}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Page {pageIndex + 1} of {pageCount}
                    </p>
                </div>

                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
