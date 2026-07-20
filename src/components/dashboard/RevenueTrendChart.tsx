"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { TRevenueTrendPoint } from "@/actions/dashboard/get"

const COLORS = {
    billed: "#2a78d6",
    collected: "#008300",
}

function formatPeriodLabel(period: string) {
    const [year, month] = period.split("-")
    const date = new Date(Number(year), Number(month) - 1, 1)
    return date.toLocaleDateString("en-US", { month: "short" })
}

function CurrencyTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
            <p className="mb-1 font-medium text-popover-foreground">{label}</p>
            {payload.map((entry: any) => (
                <p key={entry.dataKey} className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="inline-block size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}: ₱{Number(entry.value).toLocaleString()}
                </p>
            ))}
        </div>
    )
}

export function RevenueTrendChart({ data }: { data: TRevenueTrendPoint[] }) {
    const chartData = data.map((d) => ({ ...d, label: formatPeriodLabel(d.period) }))

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barGap={4}>
                <CartesianGrid vertical={false} stroke="#e1e0d9" />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={{ stroke: "#c3c2b7" }}
                    tick={{ fill: "#898781", fontSize: 12 }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#898781", fontSize: 12 }}
                    tickFormatter={(value) => `₱${Number(value).toLocaleString()}`}
                    width={80}
                />
                <Tooltip content={<CurrencyTooltip />} cursor={{ fill: "rgba(11,11,11,0.04)" }} />
                <Legend
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
                <Bar dataKey="billed" name="Billed" fill={COLORS.billed} radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="collected" name="Collected" fill={COLORS.collected} radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
        </ResponsiveContainer>
    )
}
