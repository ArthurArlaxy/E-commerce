"use server"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"

export interface Address {
    id: string;
    street: string;
    number: string
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isPrimary: boolean
    createdAt: Date
    updatedAt: Date
    userId: string;
}

export interface CreateAddress {
    street: string;
    number: string
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface UpdateAddress {
    street?: string;
    number?: string
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export async function getUserAddress() {

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/addresses`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "cookie": cookieHeader
        }
    })

    if (!response.ok) {
        return { error: response }
    }

    const addresses = await response.json()

    return addresses as Address[]
}

export async function selectPrimaryAddress(id: string) {
    const cookieStore = await cookies()
    const cookieheader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/addresses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "cookie": cookieheader
        },
        cache: "no-cache",
        body: JSON.stringify({ isPrimary: true})
    })

    if (!response.ok) {
        throw new Error("Erro ao selecionar o novo endereço principal")
    }

    const address = await response.json()

    revalidatePath("/profile")
    return address as Address
}

export async function deleteAddress(id: string) {
    const cookieStore = await cookies()
    const cookieheader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "cookie": cookieheader
        },
    })

    if (!response.ok) {
        throw new Error("Erro ao  tentar deletar o produto!")
    }

    revalidatePath("/profile")
}

export async function createAddress(data: CreateAddress){
    const cookieStore = await cookies()
    const cookieheader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/addresses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cookie": cookieheader
        },
        cache: "no-cache",
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error("Erro ao  tentar deletar o produto!")
    }

    revalidatePath("/profile")    
}

export async function updateAddress(id: string, data: UpdateAddress){

    console.log(data)

    const cookieStore = await cookies()
    const cookieheader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/addresses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "cookie": cookieheader
        },
        cache: "no-cache",
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error("Erro ao  tentar Atualizar o produto!")
    }

    revalidatePath("/profile")    
}