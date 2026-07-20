import { ContentHeader } from "@/components/layout/ContentHeader"
import CustomersTable from "@/components/customers/CustomersTable"
import { getCustomers } from "@/actions/users/get"
import { getServicePlans } from "@/actions/plans/get"
import { Card, CardContent } from "@/components/ui/card"

async function page() {
    const [customersRes, plansRes] = await Promise.all([getCustomers(), getServicePlans()])

    const planOptions = (plansRes.data ?? []).map((plan) => ({
        label: plan.name,
        value: plan.id.toString(),
    }))

    return (
        <>
            <div className="py-5">
                <div className="flex justify-center w-full">

                    <Card className="bg-green-100">
                        <CardContent className="w-full ">
                            <p>Active User</p>
                            <p className="text-3xl font-bold">1000</p>
                        </CardContent>
                    </Card>
                </div>
                <CustomersTable customers={customersRes.data ?? []} planOptions={planOptions} />
            </div>
        </>
    )
}

export default page
