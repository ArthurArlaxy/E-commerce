"use client"

import Button from "@/components/Button";
import { useRef, useState } from "react";
import styles from "./style.module.css"
import { ChevronRight } from "lucide-react";

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

export function SelectAddress({ addresses }: { addresses: AddressesProps[] }) {

    const [selectedAddress, setSelectedAddress] = useState(addresses.find((address) => address.isPrimary === true))
    const modalRef = useRef<HTMLDialogElement>(null)

    function openModal() {
        modalRef.current?.showModal()
    }

    if (!selectedAddress) {
        return (
            <>
                <p>Cadastre um endereço agora</p>
            </>
        )
    }

    return (
        <>
            <input type="hidden" name="addressId" required value={selectedAddress?.id}/>

            <button type="button" className={styles.addressCardContainer} onClick={openModal}>
                <strong className={styles.addressCardLabel}>
                    <p>Endereço:</p>
                </strong>
                <div className={styles.addressCardContent}>
                    <p className={styles.addressCardText}>{selectedAddress?.street}, {selectedAddress?.number || "S/N"}, {selectedAddress?.state}, {selectedAddress?.neighborhood}, {selectedAddress?.zipCode}</p>
                </div>
                <ChevronRight className={styles.addressCardIcon} />
            </button>

            <dialog ref={modalRef} id="addressModal" className={styles.addressCardModel}>
                <strong>
                    <p className={styles.addressCardModelText}>Selecione um endereço</p>
                </strong>
                <ul className={styles.addressCardModelContainer}>
                    {addresses.map((address) => (
                        <li key={address.id}>
                            <button className={styles.addressOption}
                                type="button"
                                onClick={() => {
                                    setSelectedAddress(address)
                                    modalRef.current?.close()
                                }}
                            >
                                <p>{address?.street}, {address?.number || "S/N"}, {address?.state}, {address?.neighborhood}, {address?.zipCode}</p>
                            </button>
                        </li>
                    ))}
                </ul>
                <button className={styles.modalBtn} type="button" onClick={() => modalRef.current?.close()}>
                    Cancelar
                </button>
            </dialog>
        </>
    )
}