export function formatCurrency(value: string | number): string {
    const numericValue = typeof value === "string" ? Number(value) : value
    return numericValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}