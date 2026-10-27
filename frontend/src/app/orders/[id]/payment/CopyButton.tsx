"use client"

import { useState } from "react"
import styles from "./styles.module.css"

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`${styles.button} ${copied ? styles.copied : ""}`}
        >
            {copied ? "Copiado!" : "Copiar código PIX"}
        </button>
    )
}