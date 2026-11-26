export function toCreate(data) {
    // Object.fromEntries perde a tipagem — o cast acontece no repositório
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value ?? null]));
}
export function toUpdate(data) {
    // Object.fromEntries perde a tipagem — o cast acontece no repositório
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
}
//# sourceMappingURL=mappers.js.map