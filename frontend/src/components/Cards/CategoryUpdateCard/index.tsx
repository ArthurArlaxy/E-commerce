import styles from "./style.module.css"
import Image from "next/image"

interface CategoryCardProps {
    id:string
    name: string
    imageUrl: string
}

export default function CategoryUpdateCard({ id, name, imageUrl }: CategoryCardProps) {
    return (
        <a className={styles.categoryCard} href={`/admin/update-category/${id}`}>
            <div className={styles.categoryImageWrapper}>
                <Image
                    fill
                    alt={`Imagem de ${name}`}
                    src={imageUrl}
                    className={styles.imageCard}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className={styles.categoryCardContent}>
                <p className={styles.categoryName}>{name}</p>
            </div>
        </a>
    )
}