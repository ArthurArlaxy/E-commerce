export class Mapper {
    static toCreate<T extends Record<string, unknown>>(data: T) {
        const result: any = {}

        for (const key in data) {
            result[key] = data[key] ?? null
        }

        return result
    }

    static toUpdate<T extends Record<string, unknown>>(data: T) {
        const result: any = {}

        for (const key in data) {
            if (data[key] !== undefined) {
                result[key] = data[key]
            }
        }

        return result
    }
}