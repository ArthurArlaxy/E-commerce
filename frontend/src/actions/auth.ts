"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface User {
    name: string;
    email: string;
    role: string;
    password: string;
}

export interface UserUpdate {
    name: string | undefined;
    email: string | undefined;
    currentPassword: string | undefined;
    newPassword: string | undefined;
}

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
}

export async function getProfile() {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(`${process.env.API_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        }
    })

    if (!response.ok) {
        throw new Error("Erro ao buscar informações do usuário")
    }

    const userInfo = await response.json()

    return userInfo
}

export async function updateUserInfo(data: UserUpdate) {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    if (data.currentPassword === "") {
        data.currentPassword = undefined
    }

    if (data.newPassword === "") {
        data.newPassword = undefined
    }

    if (data.email === "") {
        data.email = undefined
    }

    const response = await fetch(`${process.env.API_URL}/users/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error("Erro ao atualizar o produto")
    }

    const userInfo = await response.json();

    if(data.email || data.newPassword){
            cookieStore.delete({
        name: "token",
        path: "/",
    });

    redirect("/login")
    }

    revalidatePath("/profile")
}   