"use client"

import { useRef } from "react";
import styles from "./style.module.css"
import { ChevronRight } from "lucide-react";
import { Shipping } from "@/actions/shipping";
import { formatCurrency } from "@/utils/format";

interface SelectShippingProps {
    shippings: Shipping[]
    selectedShipping: Shipping
    onSelect: (shipping: Shipping) => void
}

export function SelectShipping({ shippings, selectedShipping, onSelect }: SelectShippingProps) {
    const modalRef = useRef<HTMLDialogElement>(null)

    function openModal() {
        modalRef.current?.showModal()
    }

    return (
        <>
            <input type="hidden" name="shippingId" required value={selectedShipping.id} readOnly />

            <button type="button" className={styles.shippingCardContainer} onClick={openModal}>
                <strong className={styles.shippingCardLabel}>
                    <p>Frete:</p>
                </strong>
                <div className={styles.shippingCardContent}>
                    <p className={styles.shippingCardText}>Tipo: {selectedShipping.name}</p>
                    <p className={styles.shippingCardText}>Valor: {formatCurrency(Number(selectedShipping.price))}</p>
                    <p className={styles.shippingCardText}>Entrega em até: {selectedShipping.deliveryTime} dias</p>
                </div>
                <ChevronRight className={styles.shippingCardIcon} />
            </button>

            <dialog ref={modalRef} id="shippingModal" className={styles.shippingCardModel}>
                <strong>
                    <p className={styles.shippingCardModelText}>Selecione o tipo de frete</p>
                </strong>
                <ul className={styles.shippingCardModelContainer}>
                    {shippings.map((shipping) => (
                        <li key={shipping.id}>
                            <button className={styles.shippingOption}
                                type="button"
                                onClick={() => {
                                    onSelect(shipping)
                                    modalRef.current?.close()
                                }}
                            >
                                <p>Tipo: {shipping.name}</p>
                                <p>Valor: {formatCurrency(Number(shipping.price))}</p>
                                <p>Entrega em até: {shipping.deliveryTime} dias</p>
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