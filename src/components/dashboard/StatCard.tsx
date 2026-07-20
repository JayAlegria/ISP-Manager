import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils"

interface TStatCard {
    label: string
    value: string
    hint?: string
    accent?: "default" | "warning" | "critical"
}

const accentClasses: Record<string, string> = {
    default: "text-foreground",
    warning: "text-amber-600 dark:text-amber-400",
    critical: "text-red-600 dark:text-red-400",
}

export function StatCard({ label, value, hint, accent = "default" }: TStatCard) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={cn("text-2xl font-semibold", accentClasses[accent])}>{value}</p>
                {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
            </CardContent>
        </Card>
    )
}
