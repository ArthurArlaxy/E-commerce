import StarRating from "@/components/StarRating"


interface ReviewCardProps {
    user: string
    content: string
    rating: number
    createdAt: string | Date
}

export default function ReviewCard({ user, content, rating, createdAt }: ReviewCardProps) {
    const createdDate = new Date(createdAt)
    const today = new Date()

    const diffMs = today.getTime() - createdDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    const relativeLabel = diffDays === 0 ? "Hoje" : `há ${diffDays} dia(s)`

    return (
        <article className="review-card" aria-label={`Avaliação de ${user}`}>
            <div className="review-card-container">
                <header className="review-card-header">
                    <span className="review-author">{user}</span>
                    <time dateTime={createdDate.toISOString()} className="review-date">
                        {relativeLabel}
                    </time>
                </header>
                <StarRating rating={rating} maxStars={5} size={16}/>
            </div>

            <p className="review-content">{content}</p>
        </article>
    )
}