"use server"

import { cookies } from "next/headers";


interface Category{
    id:string,
    name: string,
    slug: string,
    imageUrl: string
    createdAt: Date
    updatedAt: Date
}

export async function getCategories(): Promise<Category[] | []>  {
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

    return categories ;
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
