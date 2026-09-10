import styles from './styles.module.css'
import { formatCurrency } from '@/utils/format'

interface OrderShippingMethodProps {
    nameSnapshot: string
    priceSnapshot: string
    deliveryTimeSnapshot: number
}

export function OrderShippingMethod({ nameSnapshot, priceSnapshot, deliveryTimeSnapshot }: OrderShippingMethodProps) {
    return (
        <div className={styles.shippingMethodContainer}>
            <p className={styles.shippingMethodLabel}>Método de envio</p>
            <div className={styles.shippingMethodRow}>
                <p className={styles.shippingMethodName}>{nameSnapshot}</p>
                <p className={styles.shippingMethodPrice}>{formatCurrency(Number(priceSnapshot))}</p>
            </div>
            <p className={styles.shippingMethodTime}>
                {`Prazo estimado: ${deliveryTimeSnapshot} dia${deliveryTimeSnapshot !== 1 ? "s" : ""} útil${deliveryTimeSnapshot !== 1 ? "eis" : ""}`}
            </p>
        </div>
    )
}