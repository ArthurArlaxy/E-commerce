export function toCreate<T extends Record<string, unknown>>(data: T) {
    // Object.fromEntries perde a tipagem — o cast acontece no repositório
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value ?? null])
    ) as any
}

export function toUpdate<T extends Record<string, unknown>>(data: T) {
    // Object.fromEntries perde a tipagem — o cast acontece no repositório
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as any
}