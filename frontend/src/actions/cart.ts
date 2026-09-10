"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache";

type CartResult = { error: string; success?: undefined } | { success: true; error?: undefined }

interface GetCart {
    id: string;
    items: {
        id: string;
        productId: string;
        name: string;
        slug: string;
        price: string;
        maxStock: number
        unavailable: boolean;
        quantity: number;
        selected: boolean;
        image: string;
        category: string;
        subtotal: string;
    }[]
    selectedTotal: string;
    total: string;
}

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

export async function getCart(): Promise<GetCart> {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/cart`, {
        method: "GET",
        cache: "no-store",
        headers: {
            "Content-type": "application/json",
            "Cookie": cookieHeader
        }
    })

    if (!response.ok) {
        throw new Error("Erro ao procurar o carrinho")
    }

    const cart = await response.json()

    return cart
}

export async function selectedToBuy(id:string, selected:boolean) {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/cart/items/${id}/selection`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        body: JSON.stringify({selected})
    })

    if (!response.ok) {
        throw new Error("Erro ao procurar o carrinho")
    }

    revalidatePath("/cart")
}

export async function selectQuantity(id:string, quantity: number) {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/cart/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        body: JSON.stringify({quantity})
    })

    if (!response.ok) {
        throw new Error("Erro ao procurar o carrinho")
    }

    revalidatePath("/cart")
}

export async function deleteProductFromCart(id:string) {
    
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/cart/items/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        }
    })

    console.log(response)

    if(!response.ok){
        throw new Error("Erro ao deletar o produto")
    }

    revalidatePath("/cart")
}