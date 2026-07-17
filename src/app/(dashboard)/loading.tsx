import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full py-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-6" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="size-8 rounded-full" />
            </div>

            <div className="py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Skeleton className="h-8 flex-1 max-w-sm" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="size-8" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                </div>

                <div className="rounded-2xl border p-2">
                    <div className="flex gap-4 border-b px-4 py-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 flex-1" />
                        ))}
                    </div>
                    {Array.from({ length: 6 }).map((_, row) => (
                        <div key={row} className="flex gap-4 px-4 py-3">
                            {Array.from({ length: 5 }).map((_, col) => (
                                <Skeleton key={col} className="h-4 flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
