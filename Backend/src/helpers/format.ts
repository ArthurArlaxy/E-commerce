export function toCents(value: string | number): number {
    const clean = String(value).trim().replace(/[^\d.,]/g, "")
    const [intPart = "", decPart = ""] = clean.split(/[.,](?=\d{1,2}$)/)
    const cents = intPart.replace(/\D/g, "") + decPart.padEnd(2, "0")
    return Number(cents)
}
