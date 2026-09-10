"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"


export interface OrderState {
    error?: string
}

export interface OrderProductImage {
    id: string
    url: string
    order: number
    isCover: boolean
    productId: string
}

export interface OrderListItem {
    id: string
    total: string
    status: string
    createdAt: string
    updatedAt: string | null
    userId: string
    shippingStreet: string
    shippingNumber: string | null
    shippingComplement: string | null
    shippingNeighborhood: string
    shippingCity: string
    shippingState: string
    shippingZipCode: string
    products: {
        nameSnapshot: string
        quantity: number
        priceSnapshot: string
        product: {
            slug: string
            images: OrderProductImage[] 
        }
    }[]
}

export interface OrderDetail extends Omit<OrderListItem, "products"> {
    products: {
        nameSnapshot: string
        quantity: number
        priceSnapshot: string
        product: {
            id: string
            slug: string
            images: OrderProductImage[]
            productCategories: {
                category: { id: string; name: string }
            }[]
        }
    }[]
    shipping: {
        nameSnapshot: string
        priceSnapshot: string
        deliveryTimeSnapshot: number
    }
}

export async function createOrder(prevState: OrderState, formData: FormData): Promise<OrderState> {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const addressId = formData.get("addressId")
    const shippingId = formData.get("shippingId")

    if (!addressId || !shippingId) {
        return { error: "Campos faltando para realizar a compra" }
    }

    const response = await fetch(`${process.env.API_URL}/orders`, {
        method: "POST",
        body: JSON.stringify({ addressId, shippingId }),
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        cache: "no-cache"
    })

    if (!response.ok) {
        return { error: "Erro ao criar um produto" }
    }

    redirect("/orders")
}

export async function getOrder() {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/orders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        }
    })

    if(!response.ok){
        return { error: "Erro ao buscar produtos"}
    }

    const orders = await response.json()

    return orders
}

export async function getOrderById(id:string) {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/orders/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        }
    })

    if(!response.ok){
        return { error: "Erro ao buscar produtos"}
    }

    const orders = await response.json()

    return orders
}