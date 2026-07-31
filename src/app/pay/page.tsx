import { PaymentPortalHeader } from "@/components/payments/PaymentPortalHeader"
import { PublicPaymentReceiptForm } from "@/components/payments/PublicPaymentReceiptForm"

export const metadata = {
    title: "Payment Portal - HI TECHY",
}

export default function PayPage() {
    return (
        <div className="min-h-svh bg-muted/30">
            <PaymentPortalHeader />
            <div className="relative -mt-10 flex justify-center px-6 pb-12 md:-mt-14">
                <PublicPaymentReceiptForm />
            </div>
        </div>
    )
}
