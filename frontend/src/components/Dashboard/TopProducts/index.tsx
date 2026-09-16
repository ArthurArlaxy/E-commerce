import { TopProductItem } from "@/actions/dashboard";
import styles from "./styles.module.css";

interface TopProductsProps {
    data: TopProductItem[];
}

export default function TopProducts({ data }: TopProductsProps) {
    return (
        <section className={styles.card}>
            <h2 className={styles.title}>Produtos mais vendidos</h2>
            <span className={styles.subtitle}>ano corrente · top 5 por quantidade</span>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <colgroup>
                        <col className={styles.colRank} />
                        <col />
                        <col className={styles.colQty} />
                        <col className={styles.colOrders} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Produto</th>
                            <th className={styles.numberHeader}>Qtd. vendida</th>
                            <th className={styles.numberHeader}>Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((product, index) => (
                            <tr key={product.nameSnapshot}>
                                <td className={styles.rank}>{index + 1}</td>
                                <td className={styles.name}>{product.nameSnapshot}</td>
                                <td className={styles.number}>{product._sum.quantity ?? 0}</td>
                                <td className={styles.number}>{product._count.id}</td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className={styles.empty}>
                                    Nenhuma venda registrada neste período.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}