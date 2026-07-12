import CustomersCount from "@/components/customers/CustomersCount"
import { ContentHeader } from "@/components/layout/ContentHeader"
import CustomersContent from "@/components/customers/CustomersContent"
import CustomersHeader from "@/components/customers/CustomersHeader"

function page() {
    return (
        <>
            <ContentHeader pageTitle="Customers" />
            <div className="py-5">
                <CustomersHeader />
                <CustomersCount />
                <CustomersContent />
            </div>
        </>
    )
}

export default page