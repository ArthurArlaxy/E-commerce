"use client"

import FormInputLabel from "@/components/inputs/formInputLabel";
import { useRef, useState, useTransition } from "react";
import styles from "./style.module.css"
import { ChevronRight } from "lucide-react";
import { updateUserInfo, User } from "@/actions/auth";

interface UpdateData {
    name: string;
    email: string | undefined;
    currentPassword: string;
    newPassword: string;
}

export function UserUpdateForm({ user }: { user: User }) {

    const [isPending, startTransition] = useTransition()
    const [userUpdateError, setUserUpdateError] = useState<string | undefined>()
    const [pendingData, setPendingData] = useState<UpdateData | null>(null)
    const modalRef = useRef<HTMLDialogElement>(null)
    const confirmModal = useRef<HTMLDialogElement>(null)

    // Só monta os dados e pede confirmação — ainda não envia nada
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const name = formData.get("name") as string
        let email = formData.get("email") as string | undefined
        const currentPassword = formData.get("currentPassword") as string
        const newPassword = formData.get("newPassword") as string

        email = email !== user.email ? email : undefined

        setPendingData({ name, email, currentPassword, newPassword })
        setUserUpdateError(undefined)

        modalRef.current?.close()
        confirmModal.current?.showModal()
    }

    // Só é chamada quando o usuário confirma de fato
    function handleConfirm() {
        if (!pendingData) return

        confirmModal.current?.close()

        startTransition(async () => {
            try {
                await updateUserInfo(pendingData)
            } catch (error) {
                if (error instanceof Error) {
                    setUserUpdateError(error.message)
                } else {
                    setUserUpdateError("Erro ao atualizar")
                }
                setPendingData(null)
                modalRef.current?.showModal()
            }
        })
    }

    return (
        <>
            <button className={styles.userUpdateCardContainer}
                onClick={() => modalRef.current?.showModal()}
            >
                <strong><p className={styles.userUpdateCardLabel}>Trocar informações da conta</p></strong>
                <ChevronRight className={styles.userUpdateCardIcon} />
            </button>

            <dialog ref={modalRef} id="userUpdateModal" className={styles.userModel}>
                <form onSubmit={handleSubmit} className={styles.editForm}>

                    <strong>
                        <p className={styles.userModalText}>Informações do Usuário</p>
                    </strong>

                    <FormInputLabel inputName="name" label="Nome" type="text" value={user.name} />
                    <FormInputLabel inputName="email" label="Email" type="text" value={user.email} />
                    <FormInputLabel inputName="currentPassword" label="Senha Atual" type="password" />
                    <FormInputLabel inputName="newPassword" label="Senha Nova" type="password" required={false} />

                    {userUpdateError && <p className={styles.errorText}>{userUpdateError}</p>}

                    <div className={styles.buttonActionContainers}>
                        <button className={styles.modalBtnExit}
                            type="button"
                            onClick={() => modalRef.current?.close()}>
                            Cancelar
                        </button>
                        <button className={styles.modalBtn}
                            type="submit"
                            disabled={isPending}>
                            {isPending ? "Salvando..." : "Alterar"}
                        </button>
                    </div>
                </form>
            </dialog>

            <dialog ref={confirmModal} className={styles.userModel}>
                <strong>
                    <p>Deseja confirmar a alteração?</p>
                </strong>
                <div className={styles.buttonActionContainers}>
                    <button className={styles.modalBtnExit}
                        type="button"
                        onClick={() => {
                            setPendingData(null)
                            confirmModal.current?.close()
                            modalRef.current?.showModal()
                        }}
                    >
                        Cancelar
                    </button>
                    <button className={styles.modalBtn}
                        type="button"
                        onClick={handleConfirm}>
                        Confirmar
                    </button>
                </div>
            </dialog>
        </>
    )
}