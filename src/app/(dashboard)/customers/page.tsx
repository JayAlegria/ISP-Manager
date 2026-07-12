import { ContentHeader } from "@/components/layout/ContentHeader"
import CustomersTable from "@/components/customers/CustomersTable"
import { getCustomers } from "@/actions/users/get"
import { getServicePlans } from "@/actions/plans/get"

async function page() {
    const [customersRes, plansRes] = await Promise.all([getCustomers(), getServicePlans()])

    const planOptions = (plansRes.data ?? []).map((plan) => ({
        label: plan.name,
        value: plan.id.toString(),
    }))

    console.log(customersRes.data)

    return (
        <>
            <ContentHeader pageTitle="Customers" />
            <div className="py-5">
                <CustomersTable customers={customersRes.data ?? []} planOptions={planOptions} />
            </div>
        </>
    )
}

export default page
