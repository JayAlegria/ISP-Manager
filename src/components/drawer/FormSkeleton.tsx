import { Skeleton } from '../ui/skeleton'

interface TFormSkeleton {
    rows?: number
}

export function FormSkeleton({ rows = 4 }: TFormSkeleton) {
    return (
        <div className="space-y-6">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ))}
        </div>
    )
}
