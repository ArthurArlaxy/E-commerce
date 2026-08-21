import Image from "next/image"

interface CategoryCardProps {
    slug: string
    name: string
    imageUrl: string
}

export default function CategoryCard({ slug, name, imageUrl }: CategoryCardProps) {
    return (
        <a className="category-card" href={`/categories/${slug}?limit=10&page=1`}>
            <div className="category-image-wrapper">
                <Image
                    fill
                    alt={`Imagem de ${name}`}
                    src={imageUrl}
                    className="category-image-card"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className="category-card-content">
                <p className="categoryName">{name}</p>
            </div>
        </a>
    )
}