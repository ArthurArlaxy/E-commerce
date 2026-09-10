import styles from './styles.module.css'
import { OrderProductItem } from "@/components/Cards/OrderProductItem"
import { formatCurrency } from '@/utils/format'
import type { OrderListItem } from '@/actions/orders'
import Link from "next/link"

const statusLabel: Record<string, string> = {
    pending: "Pendente",
    processing: "Em processamento",
    shipped: "Enviado",
    delivered: "Entregue",
    canceled: "Cancelado",
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
    })
}

export function OrderCard({ id, total, status, createdAt, products }: OrderListItem) {
    return (
        <Link href={`/orders/${id}`} className={styles.orderCardContainer}>
            <div className={styles.orderHeader}>
                <div>
                    <p className={styles.orderId}>{`Pedido #${id.slice(0, 8)}`}</p>
                    <p className={styles.orderDate}>{formatDate(createdAt)}</p>
                </div>
                <span className={`${styles.statusBadge} ${styles[status] ?? ""}`}>
                    {statusLabel[status] ?? status}
                </span>
            </div>

            <div className={styles.productsList}>
                {products.map((item, index) => (
                    <OrderProductItem
                        key={`${item.product.slug}-${index}`}
                        slug={item.product.slug}
                        name={item.nameSnapshot !== "null" ? item.nameSnapshot : item.product.slug}
                        images={item.product.images}
                        quantity={item.quantity}
                        price={item.priceSnapshot}
                    />
                ))}
            </div>

            <div className={styles.orderFooter}>
                <p className={styles.orderTotal}>Total do Pedido</p>
                <p className={styles.orderTotal}>{formatCurrency(Number(total))}</p>
            </div>
        </Link>
    )
}