import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

interface StarRatingProps {
    rating: number // aceita decimal, ex: 3.5, 4.2
    maxStars?: number
    size?: number
}

export default function StarRating({ rating, maxStars = 5, size = 18 }: StarRatingProps) {
    const stars = []

    for (let i = 1; i <= maxStars; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} size={size} color="#ffd700" />)
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} size={size} color="#ffd700" />)
        } else {
            stars.push(<FaRegStar key={i} size={size} color="#ffd700" />)
        }
    }

    return (
        <p
            className="review-rating"
            role="img"
            aria-label={`Avaliação: ${rating} de 5 estrelas`}
        >
            {stars}
        </p>
    )
}