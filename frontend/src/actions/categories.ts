"use server"
import { cookies } from "next/headers";

export async function getCategories() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // 3. Faz a requisição enviando esses cookies para o Express
    const response = await fetch(`${process.env.API_URL}/categories`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Cookie": cookieHeader 
        },
        cache: "no-store" 
    });

    if (!response.ok) {
        console.error(`Erro ${response.status}: Falha ao autenticar sessão com o Express.`);
        return [];
    }

    return response.json();
}
