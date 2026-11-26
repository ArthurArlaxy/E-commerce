export function slugCreator(name) {
    const newName = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/[^a-z0-9\s-]/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    return newName;
}
export async function uniqueSlug(baseSlug, db) {
    let slug = baseSlug;
    let count = 2;
    while (await db(slug)) {
        slug = `${baseSlug}-${count}`;
        count++;
    }
    return slug;
}
//# sourceMappingURL=slugFunctions.js.map