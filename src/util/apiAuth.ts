import { NextRequest } from "next/server"
import { timingSafeEqual } from "crypto"

export function isAuthorizedRequest(request: NextRequest, envVarName = "BILLING_API_KEY"): boolean {
    const expectedKey = process.env[envVarName]
    if (!expectedKey) return false

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) return false

    const providedKey = authHeader.slice("Bearer ".length).trim()

    const expected = Buffer.from(expectedKey)
    const provided = Buffer.from(providedKey)

    if (expected.length !== provided.length) return false

    return timingSafeEqual(expected, provided)
}
