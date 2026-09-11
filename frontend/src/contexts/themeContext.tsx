"use client"

import { setThemeAction, Theme } from "@/actions/theme"
import { createContext, useContext, useState, useTransition } from "react"

interface ThemeContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
    isPending: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode, initialTheme: Theme }) {
    const [theme, setThemeState] = useState<Theme>(initialTheme)
    const [isPending, startTransaction] = useTransition()

    function setTheme(newTheme: Theme){
        document.documentElement.setAttribute("data-theme", newTheme)
        setThemeState(newTheme)

        startTransaction(async () => {
            await setThemeAction(newTheme)
        })
    }

    return(
        <ThemeContext.Provider value={{ theme, setTheme, isPending}}>
            {children}
        </ThemeContext.Provider>
    )

}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("useTheme deve ser usado dentro de um ThemeProvider")
    return context
}