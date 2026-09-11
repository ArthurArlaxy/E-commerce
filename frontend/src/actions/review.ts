"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


export interface ReviewState {
    error?: string
}

export async function createReview(
    prevState: ReviewState | undefined,
    formData: FormData):  Promise<ReviewState | undefined> {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const productId = formData.get("productId")
    const slug = formData.get("slug")
    const comment = formData.get("comment")
    const rating = Number(formData.get("rating"))

    console.log(JSON.stringify({ rating, comment, productId }))

    if (rating === 0) {
        console.log({ error: "Selecione a nota de 1 a 5" })
        return { error: "Selecione a nota de 1 a 5" }
    }

    const response = await fetch(`${process.env.API_URL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        body: JSON.stringify({ rating, comment })
    })

    if (!response.ok) {
        console.log({ response })
        return { error: "Erro ao tentar criar comentário" }
    }

    revalidatePath(`/products/${slug}`)
}