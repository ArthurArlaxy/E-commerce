// PaymentPoller.tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function PaymentPoller() {
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => router.refresh(), 5000)
        return () => clearInterval(timer)
    }, [router])

    return null
}