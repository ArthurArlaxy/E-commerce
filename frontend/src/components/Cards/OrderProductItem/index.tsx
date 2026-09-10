import { OrderProductImage } from '@/actions/orders'
import { formatCurrency } from '@/utils/format'
import styles from "./style.module.css"
import Image from "next/image"
import Link from "next/link"

interface OrderProductItemProps {
    slug: string
    name: string
    images: OrderProductImage[]
    quantity: number
    price: string
    categories?: { id: string; name: string }[]
}

export function OrderProductItem({ slug, name, images, quantity, price, categories }: OrderProductItemProps) {
    const cover = images[0]

    return (
        <Link href={`/products/${slug}`} className={styles.itemContainer}>
            <div className={styles.itemImageContainer}>
                {cover ? (
                    <Image
                        fill
                        alt={`Imagem de ${name}`}
                        src={cover.url}
                        className={styles.itemImage}
                        sizes="(max-width: 640px) 25vw, 15vw"
                    />
                ) : (
                    <div className={styles.itemImagePlaceholder} />
                )}
            </div>
            <div className={styles.itemInfo}>
                <p className={styles.itemName}>{name}</p>
                <p className={styles.itemQuantity}>{`Qtd: ${quantity}`}</p>
                {categories && categories.length > 0 && (
                    <div className={styles.itemCategories}>
                        {categories.map(category => (
                            <span key={category.id} className={styles.categoryBadge}>{category.name}</span>
                        ))}
                    </div>
                )}
            </div>
            <p className={styles.itemPrice}>{formatCurrency(Number(price) * quantity)}</p>
        </Link>
    )
}