import { Wifi } from "lucide-react"

export function PaymentPortalHeader() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
            <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
                <defs>
                    <pattern id="portal-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#portal-dots)" />
            </svg>

            <div className="relative flex flex-col items-center gap-3 px-6 py-12 text-center md:py-16">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
                    <Wifi className="size-8 text-white" strokeWidth={2} />
                </div>
                <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-white/80">Payment Portal</p>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">HI TECHY</h1>
                    <p className="mt-1 text-sm text-white/80">The number one internet service provider.</p>
                </div>
            </div>
        </div>
    )
}
