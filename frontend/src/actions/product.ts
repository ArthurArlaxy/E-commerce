"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface ProductState {
    error?: string
}

export interface Product {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    price: Number;
    description: string;
    stock: number;
}

export async function productCreateForm(
    prevState: ProductState,
    formData: FormData
): Promise<ProductState> {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    console.log("Cookie header:", cookieHeader)

    if (!cookieHeader) {
        return { error: "Sessão expirada, faça login novamente" }
    }

    const name = formData.get("name")
    const slug = formData.get("slug")
    const price = formData.get("price")
    const categories = formData.getAll("categories")
    const images = formData.getAll("images") as File[]
    const stock = formData.get("stock")
    const coverIndex = formData.get("coverIndex")

    if (!name || !slug || !price || !categories || !images || !stock) {
        return { error: "Todos os campos precisam ser preenchidos" }
    }

    const backendFormData = new FormData()
    backendFormData.append("name", name)
    backendFormData.append("slug", slug)
    backendFormData.append("price", price)
    backendFormData.append("stock", stock)
    backendFormData.append("coverIndex", coverIndex)
    categories.forEach((categorie) => backendFormData.append("categories", categorie))
    images.forEach((image) => backendFormData.append("images", image))

    console.log({ name, slug, price, categories, images, stock })

    const response = await fetch(`${process.env.API_URL}/products`, {
        method: "POST",
        body: backendFormData,
        headers: {
            "Cookie": cookieHeader,
        },
        cache: "no-store"
    })

    if (!response.ok) {
        console.log(response)
        return { error: "Erro o criar o produto" }
    }
    const data = await response.json()

    redirect(`/products/${data.id}`)
}