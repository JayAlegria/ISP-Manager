import { ContentHeader } from "@/components/layout/ContentHeader"
import TicketsTable from "@/components/tickets/TicketsTable"
import { getTickets } from "@/actions/tickets/get"
import { getTechnicians } from "@/actions/technicians/get"
import { getCustomers } from "@/actions/users/get"

async function page() {
    const [ticketsRes, techniciansRes, customersRes] = await Promise.all([
        getTickets(),
        getTechnicians(),
        getCustomers(),
    ])

    return (
        <>
            <div className="py-5">
                <TicketsTable
                    tickets={ticketsRes.data ?? []}
                    technicians={(techniciansRes.data ?? []).map((t) => ({
                        id: t.id,
                        employee_id: t.employee_id,
                        name: t.name,
                    }))}
                    customers={(customersRes.data ?? []).map((c) => ({
                        id: c.id,
                        name: c.name || "",
                        account_number: c.account_number,
                    }))}
                />
            </div>
        </>
    )
}

export default page
