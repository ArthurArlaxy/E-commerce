import { formatCurrency } from "@/utils/format"
import styles from "./style.module.css"
import Image from "next/image"

interface ProductCardProps {
    id:string
    name: string
    price: string
    imageUrl: string
}

export default function ProductUpdateCard({ id, name, price, imageUrl }: ProductCardProps) {
    return (
        <a className={styles.productCard} href={`/admin/update-product/${id}`}>
            <div className={styles.productImageWrapper}>
                <Image
                    fill
                    alt={`Imagem de ${name}`}
                    src={imageUrl}
                    className={styles.imageCard}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className={styles.productCardContent}>
                <p className={styles.productName}>{name}</p>
                <p className={styles.productPrice}>{formatCurrency(Number(price))}</p>
            </div>
        </a>
    )
}