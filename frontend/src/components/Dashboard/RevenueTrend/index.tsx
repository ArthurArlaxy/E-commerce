import { formatCompactCurrency } from "@/utils/format";
import styles from "./styles.module.css";

interface RevenueTrendProps {
    data: { label: string; total: number }[];
}

export default function RevenueTrend({ data }: RevenueTrendProps) {
    const max = Math.max(1, ...data.map((d) => d.total));

    return (
        <section className={styles.card}>
            <h2 className={styles.title}>Faturamento por dia</h2>
            <span className={styles.subtitle}>mês corrente</span>

            {data.length > 0 ? (
                <div className={styles.chart}>
                    {data.map((day) => (
                        <div key={day.label} className={styles.column}>
                            <span className={styles.value}>
                                {formatCompactCurrency(day.total)}
                            </span>
                            <div className={styles.trackWrapper}>
                                <div
                                    className={styles.bar}
                                    style={{ height: `${(day.total / max) * 100}%` }}
                                />
                            </div>
                            <span className={styles.day}>{day.label}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.empty}>Nenhuma venda registrada neste mês.</p>
            )}
        </section>
    );
}