import { ContentHeader } from "@/components/layout/ContentHeader"
import { getDashboardMetrics } from "@/actions/dashboard/get"
import { StatCard } from "@/components/dashboard/StatCard"
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart"
import { PlanBreakdownChart } from "@/components/dashboard/PlanBreakdownChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/util/currency"
import { ticketStatusLabels } from "@/types/tickets"

async function page() {
    const res = await getDashboardMetrics()
    const metrics = res.data

    return (
        <>
            <div className="py-5 flex flex-col gap-4">
                {!metrics ? (
                    <p className="text-sm text-muted-foreground">Unable to load dashboard metrics.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Collected this month"
                                value={formatCurrency(metrics.totalCollectedThisPeriod)}
                                hint={`of ${formatCurrency(metrics.totalBilledThisPeriod)} billed`}
                            />
                            <StatCard
                                label="Collection rate"
                                value={`${metrics.collectionRatePercent}%`}
                                accent={metrics.collectionRatePercent < 70 ? "warning" : "default"}
                            />
                            <StatCard
                                label="Outstanding"
                                value={formatCurrency(metrics.outstandingAmount)}
                                hint={`${metrics.overdueCount} overdue (${formatCurrency(metrics.overdueAmount)})`}
                                accent={metrics.overdueCount > 0 ? "critical" : "default"}
                            />
                            <StatCard
                                label="Payments to verify"
                                value={String(metrics.pendingVerificationCount)}
                                accent={metrics.pendingVerificationCount > 0 ? "warning" : "default"}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue trend (last 6 months)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RevenueTrendChart data={metrics.revenueTrend} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscribers by plan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {metrics.planBreakdown.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No active subscriptions yet.</p>
                                    ) : (
                                        <PlanBreakdownChart data={metrics.planBreakdown} />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tickets by status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {Object.entries(metrics.ticketStatusCounts).map(([status, count]) => (
                                        <div key={status} className="flex flex-col items-center rounded-lg border px-4 py-2">
                                            <span className="text-lg font-semibold">{count}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {ticketStatusLabels[status] ?? status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    )
}

export default page
