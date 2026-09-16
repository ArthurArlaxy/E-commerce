"use server"

import { cookies } from "next/headers"

export type OrderStatus =
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"

export interface OrderSummary {
    total: string
    createdAt: string
}

export interface OrdersByStatusItem {
    status: OrderStatus
    _count: { id: number }
}

export interface TopProductItem {
    nameSnapshot: string
    _sum: { quantity: number | null }
    _count: { id: number }
}

export interface DashboardData {
    daily: { dayOrders: OrderSummary[]; dayOrdersCount: number }
    monthly: { monthOrders: OrderSummary[]; monthOrdersCount: number }
    yearly: { yearOrders: OrderSummary[]; yearOrdersCount: number }
    ordersByStatus: OrdersByStatusItem[]
    topProducts: TopProductItem[]
}

export interface DashboardState {
    error: string
}

export async function getDashboardInfo(): Promise<DashboardData | DashboardState> {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/admin/dashboardInfo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        cache: "no-cache"
    })

    if (!response.ok) {
        return { error: "Erro ao buscar informações do dashboard" } as DashboardState
    }

    const data = await response.json()

    return data 
}