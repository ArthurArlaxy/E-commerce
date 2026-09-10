// components/forms/cartForm.tsx
"use client"

import { useActionState, useState } from "react"
import { createOrder, OrderState } from "@/actions/orders"
import { Shipping } from "@/actions/shipping"
import Button from "@/components/Button"
import { CartValueSection } from "@/components/CartValueSection"
import { ReactNode } from "react"
import { SelectShipping } from "@/components/inputs/selectShipping"
import { Address } from "@/actions/address"
import { SelectAddress } from "@/components/inputs/selectAddress"
import styles from "./style.module.css"


const initialState: OrderState = {}

export function CartForm({
    children,
    shippings,
    total,
    selectedTotal,
    addresses
}: {
    children: ReactNode
    shippings: Shipping[]
    total: string
    selectedTotal: string
    addresses: Address[]
}) {
    const [state, formAction, isPending] = useActionState(createOrder, initialState)
    const [selectedShipping, setSelectedShipping] = useState(shippings[0])

    return (
        <form className={`cartContainer ${styles.cartForm}`} action={formAction}>
            <section className={styles.selectDeliverySection}>
                <SelectAddress addresses={addresses} />
                <SelectShipping
                    shippings={shippings}
                    selectedShipping={selectedShipping}
                    onSelect={setSelectedShipping}
                />
            </section>

            {children}
            <CartValueSection
                total={total}
                selectedTotal={selectedTotal}
                shippingPrice={selectedShipping?.price ?? "0"}
            />

            {state?.error && <p className={styles.errorText}>{state.error}</p>}
            <Button text="Comprar" disabled={isPending} />
        </form>
    )
}