import { ContentHeader } from "@/components/layout/ContentHeader"
import PaymentsTable from "@/components/payments/PaymentsTable"
import { getPayments } from "@/actions/payments/get"

async function page() {
    const paymentsRes = await getPayments()

    return (
        <>
            <ContentHeader pageTitle="Payments" />
            <div className="py-5">
                <PaymentsTable payments={paymentsRes.data ?? []} />
            </div>
        </>
    )
}

export default page
