"use server"
import { cookies } from "next/headers"


export interface Shipping{
    id: string;
    name: string;
    price: string;
    deliveryTime: number;
}

export async function getShippings() : Promise<Shipping[]>{

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/shippings`, {
        method: "GET",
        headers: {
            "Cookie": cookieHeader
        }
    })



    if(!response.ok){
        throw new Error("Erro ao buscar os fretes")
    }

    const shippings = response.json()

    return shippings
}