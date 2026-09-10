"use client"

import { useRef, useState, useTransition } from "react";
import styles from "./style.module.css"
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { createAddress, deleteAddress, selectPrimaryAddress, updateAddress } from "@/actions/address";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import FormInputLabel from "@/components/inputs/formInputLabel";

interface AddressesProps {
    id: string;
    street: string;
    number: string
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isPrimary: boolean
    createdAt: Date
    updatedAt: Date
    userId: string;
}

export function AddressManagerForm({ addresses }: { addresses: AddressesProps[] }) {

    const [primaryAddress, setPrimaryAddress] = useState(addresses.find((address) => address.isPrimary === true))
    const [createError, setCreateError] = useState<string | null>(null)
    const [addressToEdit, setAddressToEdit] = useState<AddressesProps | null>(null)
    const [updateError, setUpdateError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const modalRef = useRef<HTMLDialogElement>(null)
    const modalRefCreate = useRef<HTMLDialogElement>(null)
    const modalRefUpdate = useRef<HTMLDialogElement>(null)

    function handleAddressFavorite(newPrimaryAddress: AddressesProps) {
        const previus = primaryAddress
        setPrimaryAddress(newPrimaryAddress)

        startTransition(async () => {
            try {
                await selectPrimaryAddress(newPrimaryAddress.id)
            } catch (error) {
                setPrimaryAddress(previus)
                console.error(error)
            }
        })
    }

    function handleAddressDelete(id: string) {
        startTransition(async () => {
            try {
                await deleteAddress(id)
            } catch (error) {
                console.error(error)
            }
        })
    }

    function openCreateModal() {
        setCreateError(null)
        modalRef.current?.close()
        modalRefCreate.current?.showModal()
    }

    function handleCreateSubmit(formData: FormData) {
        if (!addressToEdit) return

        setCreateError(null)

        const data = {
            street: formData.get("street") as string,
            number: formData.get("number") as string,
            complement: formData.get("complement") as string,
            neighborhood: formData.get("neighborhood") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            zipCode: formData.get("zipCode") as string,
        }

        startTransition(async () => {
            try {
                await createAddress(data)
                modalRefCreate.current?.close()
                modalRef.current?.showModal()
            } catch (error: any) {
                setCreateError(error?.message ?? "Erro ao atualizar endereço")
                console.error(error)
            }
        })
    }

    function openEditModal(address: AddressesProps) {
        setAddressToEdit(address)
        setUpdateError(null)
        modalRef.current?.close()
        modalRefUpdate.current?.showModal()
    }

    function handleUpdateSubmit(formData: FormData) {
        if (!addressToEdit) return

        setUpdateError(null)

        const data = {
            street: formData.get("street") as string,
            number: formData.get("number") as string,
            complement: formData.get("complement") as string,
            neighborhood: formData.get("neighborhood") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            zipCode: formData.get("zipCode") as string,
        }

        console.log(data)

        startTransition(async () => {
            try {
                await updateAddress(addressToEdit.id, data)
                modalRefUpdate.current?.close()
                modalRef.current?.showModal()
            } catch (error: any) {
                setUpdateError(error?.message ?? "Erro ao atualizar endereço")
                console.error(error)
            }
        })
    }

    function openModal() {
        modalRef.current?.showModal()
    }

    if (!primaryAddress) {
        return (
            <>
                <p>Cadastre um endereço agora</p>
            </>
        )
    }

    return (
        <>
            <button type="button" className={styles.addressCardContainer} onClick={openModal}>
                <strong className={styles.addressCardLabel}>
                    <p>Geranciar ou criar Endereços</p>
                </strong>
                <ChevronRight className={styles.addressCardIcon} />
            </button>

            <dialog ref={modalRef} id="addressModal" className={styles.addressCardModel}>
                <strong>
                    <p className={styles.addressCardModelText}>Geranciador de endereços</p>
                </strong>
                <ul className={styles.addressCardModelContainer}>
                    {addresses.map((address) => (
                        <li key={address.id} className={styles.addressCardModelContent}>
                            <button className={styles.addressOption}
                                type="button"
                                disabled={isPending || primaryAddress.id === address.id}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleAddressFavorite(address)
                                }}
                            >
                                {primaryAddress.id === address.id ? <FaStar key={1} size={30} color="#fad400" className={styles.modelIcons} /> : <FaRegStar key={1} size={30} color="#fad400" className={styles.modelIcons} />}
                            </button>
                            <p className={styles.modelAddressText}>{address?.street}, {address?.number || "S/N"}, {address?.state}, {address?.neighborhood}, {address?.zipCode}</p>
                            <button className={styles.addressOption}
                                type="button"
                                disabled={isPending}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    openEditModal(address)
                                }}
                            >
                                <Pencil className={styles.modelIcons} />
                            </button>
                            <button className={styles.addressOption}
                                type="button"
                                disabled={isPending || primaryAddress.id === address.id}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleAddressDelete(address.id)
                                }}
                            >
                                <Trash2 className={styles.modelIcons} />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className={styles.buttonActionContainers}>
                    <button className={styles.modalBtnExit} type="button" onClick={() => modalRef.current?.close()}>
                        sair
                    </button>
                    {addresses.length < 3 ? <button className={styles.modalBtn}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            modalRef.current?.close()
                            openCreateModal()
                        }}>
                        Novo
                    </button> : null}
                </div>
            </dialog>

            <dialog ref={modalRefCreate} id="addressModalCreate" className={styles.addressCardModel}>
                    <form
                        action={handleCreateSubmit}
                        className={styles.editForm}
                    >
                        <strong>
                            <p className={styles.addressCardModelText}>Criar endereço</p>
                        </strong>

                        <FormInputLabel label="Rua" inputName="street" type="text" required />
                        <FormInputLabel label="Número" inputName="number" type="number" />
                        <FormInputLabel label="Complemento" inputName="complement" type="text" />
                        <FormInputLabel label="Estado" inputName="state" type="text" required />
                        <FormInputLabel label="Bairro" inputName="neighborhood" type="text" required />
                        <FormInputLabel label="Cidade" inputName="city" type="text" required />
                        <FormInputLabel label="CEP" inputName="zipCode" type="text" required />

                        {createError && <p className={styles.errorText}>{createError}</p>}

                        <div className={styles.buttonActionContainers}>
                            <button
                                className={styles.modalBtnExit}
                                type="button"
                                disabled={isPending}
                                onClick={() => {
                                    modalRefCreate.current?.close()
                                    modalRef.current?.showModal()
                                }}
                            >
                                Cancelar
                            </button>
                            <button className={styles.modalBtn} type="submit" disabled={isPending}>
                                {isPending ? "Salvando..." : "Criar"}
                            </button>
                        </div>
                    </form>
            </dialog>

            <dialog ref={modalRefUpdate} id="addressModalUpdate" className={styles.addressCardModel}>
                {addressToEdit && (
                    <form
                        key={addressToEdit.id}
                        action={handleUpdateSubmit}
                        className={styles.editForm}
                    >
                        <strong>
                            <p className={styles.addressCardModelText}>Editar endereço</p>
                        </strong>

                        <FormInputLabel label="Rua" inputName="street" type="text" required value={addressToEdit.street} />
                        <FormInputLabel label="Número" inputName="number" type="number" value={addressToEdit.number} />
                        <FormInputLabel label="Complemento" inputName="complement" type="text" value={addressToEdit.complement} />
                        <FormInputLabel label="Estado" inputName="state" type="text" required value={addressToEdit.state} />
                        <FormInputLabel label="Bairro" inputName="neighborhood" type="text" required value={addressToEdit.neighborhood} />
                        <FormInputLabel label="Cidade" inputName="city" type="text" required value={addressToEdit.city} />
                        <FormInputLabel label="CEP" inputName="zipCode" type="text" required value={addressToEdit.zipCode} />

                        {updateError && <p className={styles.errorText}>{updateError}</p>}

                        <div className={styles.buttonActionContainers}>
                            <button
                                className={styles.modalBtnExit}
                                type="button"
                                disabled={isPending}
                                onClick={() => {
                                    modalRefUpdate.current?.close()
                                    modalRef.current?.showModal()
                                }}
                            >
                                Cancelar
                            </button>
                            <button className={styles.modalBtn} type="submit" disabled={isPending}>
                                {isPending ? "Salvando..." : "Alterar"}
                            </button>
                        </div>
                    </form>
                )}
            </dialog>
        </>
    )
}