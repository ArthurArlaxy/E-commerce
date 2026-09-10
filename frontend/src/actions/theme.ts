"use server"

import { cookies } from "next/headers"

export type Theme = "light" | "dark" | "contrast"

export async function setThemeAction(theme: Theme) {
    const cookieStore = await cookies()

    cookieStore.set("theme", theme, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, 
        sameSite: "lax",
    })
}