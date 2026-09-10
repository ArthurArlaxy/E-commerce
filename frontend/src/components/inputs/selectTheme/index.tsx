"use client"

import { ChevronRight, Contrast, Moon, Sun } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/contexts/themeContext"
import styles from "./style.module.css"

export function SelectTheme() {
    const modalRef = useRef<HTMLDialogElement>(null)
    const { theme, setTheme } = useTheme()

    function handleTheme(newTheme: "light" | "dark" | "contrast") {
        setTheme(newTheme)
        modalRef.current?.close()
    }

    return (
        <>
            <button className={styles.themeCardContainer} onClick={() => modalRef.current?.showModal()}>
                <strong><p className={styles.themeCardLabel}>Selecionar Tema</p></strong>
                <ChevronRight className={styles.themeCardIcon} />
            </button>

            <dialog ref={modalRef} className={styles.themeCardModel}>
                <p className={styles.themeCardModelText}>Selecione o tema</p>
                <div className={styles.themeCardModelContainer}>
                    <button className={`${styles.themeOptions} ${theme === "light" ? styles.active : ""}`} type="button" onClick={() => handleTheme("light")}>
                        <Sun /><p>Claro</p>
                    </button>
                    <button className={`${styles.themeOptions} ${theme === "dark" ? styles.active : ""}`} type="button" onClick={() => handleTheme("dark")}>
                        <Moon /><p>Escuro</p>
                    </button>
                    <button className={`${styles.themeOptions} ${theme === "contrast" ? styles.active : ""}`} type="button" onClick={() => handleTheme("contrast")}>
                        <Contrast /><p>Contraste</p>
                    </button>
                </div>
                <button className={styles.modalBtnExit} type="button" onClick={() => modalRef.current?.close()}>
                    Sair
                </button>
            </dialog>
        </>
    )
}