import { InstallationRequestHeader } from "@/components/installation/InstallationRequestHeader"
import { InstallationRequestForm } from "@/components/installation/InstallationRequestForm"
import { getPlansByStatus } from "@/util/planQueries"

export const metadata = {
    title: "Installation Request - HI TECHY",
}

export default async function InstallPage() {
    const plans = await getPlansByStatus("active")

    return (
        <div className="min-h-svh bg-muted/30">
            <InstallationRequestHeader />
            <div className="relative -mt-10 flex justify-center px-6 pb-12 md:-mt-14">
                <InstallationRequestForm plans={plans} />
            </div>
        </div>
    )
}
