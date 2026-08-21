import Image from "next/image"

interface ProductCardProps {
    slug: string
    name: string
    price: string
    imageUrl: string
}

export default function ProductCard({ slug, name, price, imageUrl }: ProductCardProps) {
    return (
        <a className="product-card" href={`/products/${slug}`}>
            <div className="product-image-wrapper">
                <Image
                    fill
                    alt={`Imagem de ${name}`}
                    src={imageUrl}
                    className="image-card"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className="product-card-content">
                <p className="productName">{name}</p>
                <p className="productPrice">R$ {price}</p>
            </div>
        </a>
    )
}