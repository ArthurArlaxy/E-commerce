import { OrderSummary } from "@/actions/dashboard";

export function formatCurrency(value: number | string): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(value));
}

export function formatCompactCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        notation: value >= 10000 ? "compact" : "standard",
        maximumFractionDigits: value >= 10000 ? 1 : 2,
    }).format(value);
}

export function sumTotal(orders: OrderSummary[]): number {
    return orders.reduce((acc, order) => acc + Number(order.total), 0);
}

export function groupByDay(
    orders: OrderSummary[]
): { label: string; total: number }[] {
    const map = new Map<string, number>();

    for (const order of orders) {
        const date = new Date(order.createdAt);
        const key = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        });
        map.set(key, (map.get(key) ?? 0) + Number(order.total));
    }

    return Array.from(map.entries())
        .map(([label, total]) => ({ label, total }))
        .sort((a, b) => {
            const [da, ma] = a.label.split("/").map(Number);
            const [db, mb] = b.label.split("/").map(Number);
            return ma - mb || da - db;
        });
}