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

export interface ProductById {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    price: Number;
    description: string;
    stock: number;
    images: {
        id: string;
        url: string;
        order: number;
        isCover: boolean;
        productId: string
    }[]
    productCategories: {
        category: {
            id: string;
            name: string;
            slug: string;
        }
    }[]
}

interface Image {
    id: string;
    url: string;
    order: number;
    isCover: boolean;
    productId: string
}

export async function productCreateForm(
    prevState: ProductState,
    formData: FormData
): Promise<ProductState> {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    if (!cookieHeader) {
        return { error: "Sessão expirada, faça login novamente" }
    }

    const name = formData.get("name")
    const slug = formData.get("slug")
    const description = formData.get("description")
    const price = formData.get("price")
    const categories = formData.getAll("categories")
    const images = formData.getAll("images") as File[]
    const stock = formData.get("stock")
    const coverIndex = formData.get("coverIndex")

    if (!name || !slug || !description || !price || !categories || !images || !stock || !coverIndex) {
        return { error: "Todos os campos precisam ser preenchidos" }
    }

    const backendFormData = new FormData()
    backendFormData.append("name", name)
    backendFormData.append("slug", slug)
    backendFormData.append("price", price)
    backendFormData.append("stock", stock)
    backendFormData.append("description", description)
    backendFormData.append("coverIndex", coverIndex)
    categories.forEach((category) => backendFormData.append("categoriesIds", category))
    images.forEach((image) => backendFormData.append("images", image))

    const response = await fetch(`${process.env.API_URL}/products`, {
        method: "POST",
        body: backendFormData,
        headers: {
            "Cookie": cookieHeader,
        },
        cache: "no-store"
    })

    if (!response.ok) {
        return { error: "Erro o criar o produto" }
    }

    const data = await response.json()

    redirect(`/products/${data.id}`)
}

export async function getProductById(id: string) {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/products/id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "cookie": cookieHeader
        }
    })

    if (!response.ok) {
        return { error: "Erro ao tenter vizualizar o produto" }
    }

    const product: Promise<ProductById> = await response.json()

    return product
}