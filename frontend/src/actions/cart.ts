"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

type CartResult = { error: string; success?: undefined } | { success: true; error?: undefined }

async function addProductToCart(productId: string, quantity: number): Promise<CartResult> {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return { error: "Não autenticado" }
    }

    const response = await fetch(`${process.env.API_URL}/cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        body: JSON.stringify({ productId, quantity })
    })

    if (!response.ok) {
        return { error: "Falha ao adicionar ao carrinho" }
    }

    return { success: true }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<CartResult> {
    return addProductToCart(productId, quantity)
}

export async function addToCartAndBuy(productId: string, quantity: number = 1): Promise<CartResult> {
    const result = await addProductToCart(productId, quantity)

    if (result.error) {
        return result
    }

    redirect("/cart")
}