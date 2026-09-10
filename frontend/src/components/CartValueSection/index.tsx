"use client"

import styles from "./styles.module.css"
import { formatCurrency } from "@/utils/format";

export function CartValueSection({ total, selectedTotal, shippingPrice }: { total: string; selectedTotal: string; shippingPrice: string }) {
    const totalNumber = Number(total)
    const selectedTotalNumber = Number(selectedTotal)
    const shippingTotal = Number(shippingPrice)
    const finalTotal = selectedTotalNumber + Number(shippingPrice)

    return (
        <section className={styles.valueSection}>
            <div className={styles.row}>
                <p className={styles.rowLabel}>Valor total dos produtos</p>
                <p className={styles.rowValue}>{formatCurrency(totalNumber)}</p>
            </div>
            <div className={styles.row}>
                <p className={styles.rowLabel}>Valor dos produtos selecionados</p>
                <p className={styles.rowValue}>{formatCurrency(selectedTotalNumber)}</p>
            </div>
            <div className={styles.row}>
                <p className={styles.rowLabel}>Valor do frete</p>
                <p className={styles.rowValue}>{formatCurrency(shippingTotal)}</p>
            </div>
            <div className={styles.totalRow}>
                <p className={styles.totalLabel}>Total da compra</p>
                <p className={styles.totalValue}>{formatCurrency(finalTotal)}</p>
            </div>
        </section>
    )
}