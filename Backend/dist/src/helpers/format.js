export function toCents(value) {
    const clean = String(value).trim().replace(/[^\d.,]/g, "");
    const [intPart = "", decPart = ""] = clean.split(/[.,](?=\d{1,2}$)/);
    const cents = intPart.replace(/\D/g, "") + decPart.padEnd(2, "0");
    return Number(cents);
}
//# sourceMappingURL=format.js.map