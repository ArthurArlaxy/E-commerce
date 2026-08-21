"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface GetProductsParams {
    name?: string
    maxPrice?: string
    minPrice?: string
    categories?: string | string[]
    includeOutOfStock?: string
    isActive?: string
    orderBy?: string
    order?: string
    page?: string
    limit?: string
    take?: number
}

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
    images: {
        id: string;
        url: string;
        order: number;
        isCover: boolean;
        productId: string
    }[]
}

export interface GetProducts {
    items: {
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
    }[]
    total: number
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

export interface ProductBySlug {
    product: {
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
        reviews: {
            user:{
                name:string
            }
            id:string;
            createdAt: Date;
            rating: number;
            comment: string;
        }[]
    }
    totalReview:number
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

    redirect(`/admin/create-product`)
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

export async function getProductBySlug(slug: string) {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/products/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "cookie": cookieHeader
        }
    })

    if (!response.ok) {
        return { error: "Erro ao tenter vizualizar o produto" }
    }

    const product: Promise<ProductBySlug> = await response.json()

    return product
}


export async function getProducts({
    name,
    maxPrice,
    minPrice,
    categories,
    includeOutOfStock,
    isActive,
    orderBy,
    order,
    page,
    limit,
}: GetProductsParams = {}) {

    const params = new URLSearchParams()

    if (name) {
        params.set("name", name)
    }

    if (maxPrice) {
        params.set("maxPrice", maxPrice)
    }

    if (minPrice) {
        params.set("minPrice", minPrice)
    }

    if (categories) {
        const categoryParam = Array.isArray(categories)
            ? categories.join(",")
            : categories

        params.set("categories", categoryParam)
    }

    if (includeOutOfStock) {
        params.set("includeOutOfStock", includeOutOfStock)
    }

    if (isActive) {
        params.set("isActive", isActive)
    }

    if (orderBy) {
        params.set("orderBy", orderBy)
    }

    if (order) {
        params.set("order", order)
    }

    if (page) {
        params.set("page", page)
    }

    if (limit) {
        params.set("limit", limit)
    }

    const response = await fetch(`${process.env.API_URL}/products?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!response.ok) {
        return { error: "Erro ao tentar visualizar o produto" }
    }

    const products: GetProducts = await response.json()


    return products
}

export async function searchProducts(
    target: { type: "products" } | { type: "categories"; slug: string },
    formData: FormData
) {
    const name = formData.get("name")
    const maxPrice = formData.get("maxPrice")
    const minPrice = formData.get("minPrice")
    const categoriesIds = formData.getAll("categories")
    const includeOutOfStock = formData.get("includeOutOfStock")
    const isActive = formData.get("isActive")
    const orderBy = formData.get("orderBy")
    const order = formData.get("order")
    const page = formData.get("page")
    const limit = formData.get("limit")

    const params = new URLSearchParams()

    params.set("limit", "10")

    if (name) {
        params.set("name", String(name))
    }

    if (maxPrice) {
        params.set("maxPrice", String(maxPrice))
    }

    if (minPrice) {
        params.set("minPrice", String(minPrice))
    }

    if (categoriesIds.length > 0) {
        params.set("categories", categoriesIds.join(","))
    }

    if (includeOutOfStock) {
        params.set("includeOutOfStock", String(includeOutOfStock))
    }

    if (isActive) {
        params.set("isActive", String(isActive))
    }

    if (orderBy) {
        params.set("orderBy", String(orderBy))
    }

    if (order) {
        params.set("order", String(order))
    }

    if (page) {
        params.set("page", String(page))
    } else {
        params.set("page", "1")
    }

    if (limit) {
        params.set("limit", String(limit))
    }

    const basePath = target.type === "categories" ? `/categories/${target.slug}` : "/products"

    redirect(`${basePath}?${params.toString()}`)
}

export async function updateCreateForm(
    prevState: ProductState,
    formData: FormData
): Promise<ProductState> {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    if (!cookieHeader) {
        return { error: "Sessão expirada, faça login novamente" }
    }

    const id = formData.get("id")
    const name = formData.get("name")
    const slug = formData.get("slug")
    const description = formData.get("description")
    const price = formData.get("price")
    const categories = formData.getAll("categories")
    const images = formData.getAll("images") as File[]
    const stock = formData.get("stock")
    const coverIndex = formData.get("coverIndex")

    if (!id || !name || !slug || !description || !price || !categories || !images || !stock || !coverIndex) {
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

    const response = await fetch(`${process.env.API_URL}/products/${id}`, {
        method: "PUT",
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