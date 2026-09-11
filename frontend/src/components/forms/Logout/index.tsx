"use client"

import { useRef } from "react"
import styles from "./styles.module.css"
import { logout } from "@/actions/auth"

export function Logout() {

    const modalRef = useRef<HTMLDialogElement>(null)

    return (
        <>
            <button className={styles.logoutCardContainer}
                type="button"
                onClick={
                    () => modalRef.current?.showModal()
                }>
                <strong>
                    <p >Sair da conta</p>
                </strong>
            </button>

            <dialog ref={modalRef} className={styles.logoutCardModel}>
                <p className={styles.logoutCardModelText}>Deseja sair da conta</p>
                <div className={styles.logoutBtnModelContainer}>
                    <button
                        className={styles.modalBtnExit}
                        type="button"
                        onClick={() => {
                            modalRef.current?.close()
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        className={styles.modalBtn}
                        type="submit"
                        onClick={async () => {
                            modalRef.current?.close()
                            await logout()
                        }}
                    >
                        Sair
                    </button>
                </div>
            </dialog>
        </>
    )
}