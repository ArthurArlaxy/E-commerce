"use client"

import Link from "next/link"
import { useTransition } from "react"
import styles from "./style.module.css"

type ActionResult = { error: string; success?: undefined } | { success: true; error?: undefined } | void

interface ButtonProps {
    text: string
    href?: string
    action?: () => Promise<ActionResult>
    disabled?: boolean
}

export default function Button({ text, href, action, disabled }: ButtonProps) {
    const [isPending, startTransition] = useTransition()

    function handleClick() {
        if (!action) return

        startTransition(async () => {
            const result = await action()
            if (result?.error) {
                console.error(result.error)
            }
        })
    }

    if (href) {
        return <Link className={styles.btn} href={href} >{text}</Link>
    }

    return (
        <button
            type="submit"
            className={styles.btn}
            onClick={handleClick}
            disabled={disabled || isPending}
        >
            {isPending ? "..." : text}
        </button>
    )
}