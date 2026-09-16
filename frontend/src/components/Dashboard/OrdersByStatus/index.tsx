import { OrdersByStatusItem, OrderStatus } from "@/actions/dashboard";
import styles from "./styles.module.css";

interface OrdersByStatusProps {
    data: OrdersByStatusItem[];
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pendente",
    paid: "Pago",
    processing: "Em preparo",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
}

export default function OrdersByStatus({ data }: OrdersByStatusProps) {
    const total = data.reduce((acc, item) => acc + item._count.id, 0);
    const sorted = [...data].sort((a, b) => b._count.id - a._count.id);

    return (
        <section className={styles.card}>
            <h2 className={styles.title}>Pedidos por status</h2>
            <span className={styles.subtitle}>ano corrente</span>

            <ul className={styles.list}>
                {sorted.map((item) => {
                    const percentage = total > 0 ? (item._count.id / total) * 100 : 0;

                    return (
                        <li key={item.status} className={styles.row}>
                            <div className={styles.rowHeader}>
                                <span className={styles.badge} data-status={item.status}>
                                    {STATUS_LABELS[item.status]}
                                </span>
                                <span className={styles.count}>{item._count.id}</span>
                            </div>
                            <div className={styles.track}>
                                <div
                                    className={styles.bar}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </li>
                    );
                })}

                {sorted.length === 0 && (
                    <li className={styles.empty}>Nenhum pedido registrado neste período.</li>
                )}
            </ul>
        </section>
    );
}


