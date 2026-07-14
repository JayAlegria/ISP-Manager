import { ContentHeader } from "@/components/layout/ContentHeader"
import BillingTable from "@/components/billing/BillingTable"
import { getBilling } from "@/actions/billing/get"

async function page() {
    const billingRes = await getBilling()

    return (
        <>
            <div className="py-5">
                <BillingTable billings={billingRes.data ?? []} />
            </div>
        </>
    )
}

export default page
