import { formatCurrency } from "@/utils/format"
import { OrderProductItem } from "@/components/Cards/OrderProductItem"
import { getOrderById, OrderDetail } from "@/actions/orders"
import { OrderShippingAddress } from "@/components/Cards/OrderShippingAddress"
import { OrderShippingMethod } from "@/components/Cards/OrderShippingMethod"
import styles from "./styles.module.css"
import { ReviewForm } from "@/components/forms/reviewForm"

interface OrderDetailPageProps {
    params: Promise<{ id: string }>
}

const statusLabel: Record<string, string> = {
    pending: "Pendente",
    processing: "Em processamento",
    shipped: "Enviado",
    delivered: "Entregue",
    canceled: "Cancelado",
}

export default async function Page({ params }: OrderDetailPageProps) {
    const { id } = await params
    const order: OrderDetail = await getOrderById(id)

    return (
        <main className="pageContainer flex-colomn">
            <div className={styles.pageHeader}>
                <h1 className="title">{`Pedido #${order.id.slice(0, 8)}`}</h1>
                <span className={`${styles.statusBadge} ${styles[order.status] ?? ""}`}>
                    {statusLabel[order.status] ?? order.status}
                </span>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Produtos</h2>
                <div className={styles.productsList}>
                    {order.products.map((item, index) => (
                        <OrderProductItem
                            key={item.product.id ?? index}
                            slug={item.product.slug}
                            name={item.nameSnapshot !== "null" ? item.nameSnapshot : item.product.slug}
                            images={item.product.images}
                            quantity={item.quantity}
                            price={item.priceSnapshot}
                            categories={item.product.productCategories.map(productCategorie => productCategorie.category)}
                        />
                    ))}
                </div>
            </section>

            <section className={styles.shippingGrid}>
                <OrderShippingMethod {...order.shipping} />

                <OrderShippingAddress
                    shippingStreet={order.shippingStreet}
                    shippingNumber={order.shippingNumber}
                    shippingComplement={order.shippingComplement}
                    shippingNeighborhood={order.shippingNeighborhood}
                    shippingCity={order.shippingCity}
                    shippingState={order.shippingState}
                    shippingZipCode={order.shippingZipCode}
                />
            </section>

            <section className={styles.totalRow}>
                <p className={styles.totalLabel}>Total do pedido</p>
                <p className={styles.totalValue}>{formatCurrency(Number(order.total))}</p>
            </section>
        </main>
    )
}