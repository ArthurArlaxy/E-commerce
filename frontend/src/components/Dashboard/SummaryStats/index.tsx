import { formatCurrency } from "@/utils/format";
import styles from "./styles.module.css";

interface StatBlock {
    label: string;
    revenue: number;
    ordersCount: number;
}

interface SummaryStatsProps {
    daily: StatBlock;
    monthly: StatBlock;
    yearly: StatBlock;
}

function Stat({ label, revenue, ordersCount }: StatBlock) {
    const average = ordersCount > 0 ? revenue / ordersCount : 0;

    return (
        <div className={styles.stat}>
            <span className={styles.label}>{label}</span>
            <span className={styles.revenue}>{formatCurrency(revenue)}</span>
            <div className={styles.footer}>
                <span>
                    {ordersCount} {ordersCount === 1 ? "pedido" : "pedidos"}
                </span>
                <span className={styles.divider} />
                <span>ticket médio {formatCurrency(average)}</span>
            </div>
        </div>
    );
}

export default function SummaryStats({
    daily,
    monthly,
    yearly,
}: SummaryStatsProps) {
    return (
        <section className={styles.grid}>
            <Stat {...daily} />
            <Stat {...monthly} />
            <Stat {...yearly} />
        </section>
    );
}