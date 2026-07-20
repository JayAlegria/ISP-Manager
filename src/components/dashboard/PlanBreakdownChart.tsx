"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { TPlanBreakdown } from "@/actions/dashboard/get"

const SERIES_COLOR = "#2a78d6"

function SubscriberTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
            <p className="mb-1 font-medium text-popover-foreground">{label}</p>
            <p className="text-muted-foreground">Subscribers: {payload[0].value}</p>
        </div>
    )
}

export function PlanBreakdownChart({ data }: { data: TPlanBreakdown[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid horizontal={false} stroke="#e1e0d9" />
                <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#898781", fontSize: 12 }}
                    allowDecimals={false}
                />
                <YAxis
                    type="category"
                    dataKey="planName"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#0b0b0b", fontSize: 12 }}
                    width={100}
                />
                <Tooltip content={<SubscriberTooltip />} cursor={{ fill: "rgba(11,11,11,0.04)" }} />
                <Bar dataKey="subscriberCount" name="Subscribers" fill={SERIES_COLOR} radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
        </ResponsiveContainer>
    )
}
