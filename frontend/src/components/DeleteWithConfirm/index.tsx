"use client"

import { useActionState, useRef } from "react"
import styles from "./style.module.css"

type State = { error?: string }

interface Props {
    action: (prev: State, formData: FormData) => Promise<State>
    id: string
    itemName: string
    label?: string
}

export default function DeleteWithConfirm({ action, id, itemName, label = "Excluir" }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [state, formAction, isPending] = useActionState(action, {})

    return (
        <>
            <button type="button" className={styles.btn} onClick={() => dialogRef.current?.showModal()}>
                {label}
            </button>

            <dialog ref={dialogRef} className={styles.dialog}>
                <form className={styles.form} action={formAction}>
                    <input type="hidden" name="id" value={id} />

                    <p className={styles.text}>
                        Excluir "{itemName}"? Essa ação não pode ser desfeita.
                    </p>

                    {state.error && <p className={styles.errorText}>{state.error}</p>}

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={() => dialogRef.current?.close()}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.confirmBtn} disabled={isPending}>
                            {isPending ? "...Aguarde" : "Confirmar exclusão"}
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    )
}