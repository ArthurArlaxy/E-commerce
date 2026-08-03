"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface AuthState {
    error?: string;
}

export async function registerAction(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = "client";

    if (!name || !email || !password) {
        return { error: "Preencha todos os campos." };
    }

    let data;
    try {
        const response = await fetch(`${process.env.API_URL}/register`, {
            method: "POST",
            body: JSON.stringify({ name, email, password, role }),
            headers: { "Content-Type": "application/json" },
        });


        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            return { error: errorBody?.message ?? "Não foi possível acessar a conta." }
        }

        data = await response.json();
        
    } catch {
        return { error: "Erro de conexão. Tente novamente." };
    }

    if (!data?.token) {
        return { error: "Resposta inválida do servidor." };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    redirect("/");
};

export async function loginAction(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
        return { error: "Preencha todos os campos" }
    }

    let data
    try {

        const response = await fetch(`${process.env.API_URL}/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
        })


        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            return { error: errorBody?.message ?? "Não foi possível acessar a conta." }
        }

        data = await response.json();
        console.log(data)

    } catch (error) {
        return { error: "Erro de conexão. Tente novamente." };
    }

    if (!data.token) {
        return { error: "Resposta inválida do servidor." };
    }

    const cookieStore = await cookies()
    cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })

    redirect("/")
};