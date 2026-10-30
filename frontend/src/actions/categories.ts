"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers";


export interface Category {
    id: string,
    name: string,
    slug: string,
    imageUrl: string
    createdAt: Date
    updatedAt: Date
}

export interface CategoryState {
    error?: string
}

export async function getCategories(): Promise<Category[] | []> {
    const response = await fetch(`${process.env.API_URL}/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store"
    });

    if (!response.ok) {
        console.error(`Erro ${response.status}: Falha ao buscar categorias`);
        return [];
    }

    const categories = await response.json() as Category[]

    return categories;
}

export async function getCategoryBySlug(slug?: string): Promise<Category | null> {

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!slug || !token) {
        return null;
    }

    const response = await fetch(`${process.env.API_URL}/categories/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        cache: "no-store"
    });

    if (!response.ok) {
        console.error(`Erro ${response.status}: Falha ao buscar categorias`);
        return null;
    }

    const category = await response.json() as Category;

    return category;
}

export async function getCategoryById(id?: string): Promise<Category | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!id || !token) {
        return null;
    }

    const response = await fetch(`${process.env.API_URL}/categories/id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${token}`
        },
        cache: "no-store"
    });

    if (!response.ok) {
        console.error(`Erro ${response.status}: Falha ao buscar categorias`);
        return null;
    }

    const category = await response.json() as Category;

    return category;
}


export async function categoryCreateForm(prevState: CategoryState, formData: FormData): Promise<CategoryState> {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    if (!cookieHeader) {
        return { error: "Sessão expirada, faça login novamente" }
    }

    const name = formData.get("name")
    const slug = formData.get("slug")

    const images = (formData.getAll("images") as File[]).filter(
        (file) => file instanceof File && file.size > 0
    )

    if (!name || !images) {
        return { error: "É necessário preencher todos os campos" }
    }

    const backendFormData = new FormData()

    backendFormData.append("name", name)

    if (slug) {
        backendFormData.append("slug", slug)
    }

    if (images.length === 0) {
        return { error: "Para criar a categoria é necessário uma imagem" }
    }

    if (images.length > 1) {
        return { error: "A categoria aceita apenas uma imagem" }
    }

    backendFormData.append("images", images[0])

    console.log(backendFormData)

    const response = await fetch(`${process.env.API_URL}/categories`, {
        method: "POST",
        body: backendFormData,
        headers: {
            "Cookie": cookieHeader
        }
    })

    if (!response.ok) {
        return { error: "Erro no contato com o servidor" }
    }

    const data = await response.json()

    console.log(data)

    redirect(`/admin/create-category`)
}


export async function categoryUpdateForm(prevState: CategoryState, formData: FormData): Promise<CategoryState> {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    if (!cookieHeader) {
        return { error: "Sessão expirada, faça login novamente" }
    }

    const id = formData.get("id")
    const name = formData.get("name")
    const slug = formData.get("slug")

    const images = (formData.getAll("images") as File[]).filter(
        (file) => file instanceof File && file.size > 0
    )

    if (!name || !images) {
        return { error: "É necessário preencher todos os campos" }
    }

        if (images.length === 0) {
        return { error: "Para criar a categoria é necessário uma imagem" }
    }

    if (images.length > 1) {
        return { error: "A categoria aceita apenas uma imagem" }
    }

    const backendFormData = new FormData()

    backendFormData.append("name", name)

    if (slug) {
        backendFormData.append("slug", slug)
    }

    images.forEach((image) => backendFormData.append("images", image))

    const response = await fetch(`${process.env.API_URL}/categories/${id}`, {
        method: "PUT",
        body: backendFormData,
        headers: {
            "Cookie": cookieHeader
        }
    })

    if (!response.ok) {
        return { error: "Erro no contato com o servidor" }
    }

    const data = await response.json()

    console.log(data)

    redirect(`/admin/update-category`)
}
