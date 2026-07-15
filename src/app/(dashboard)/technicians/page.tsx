import { ContentHeader } from "@/components/layout/ContentHeader"
import TechnicianTable from "@/components/technicians/TechnicianTable"
import { getTechnicians } from "@/actions/technicians/get"

async function page() {
    const techniciansRes = await getTechnicians()

    return (
        <>
            <div className="py-5">
                <TechnicianTable technicians={techniciansRes.data ?? []} />
            </div>
        </>
    )
}

export default page
