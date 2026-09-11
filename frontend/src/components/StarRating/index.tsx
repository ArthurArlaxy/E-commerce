"use client"
import { UserStar } from "lucide-react";
import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    rate?: boolean;
}

export default function StarRating({ rating, maxStars = 5, size = 18, rate = false }: StarRatingProps) {

    const [userRate, setUserRate] = useState<number>(0)

    const stars = []

    if (rate) {
        return (
            <>
                <input type="number" name="rating" hidden value={userRate} readOnly />

                <p
                    className="review-rating"
                    role="img"
                    aria-label={`Avaliação: ${userRate} de 5 estrelas`}
                >
                    <button type="button" className="" onClick={() => { setUserRate(1) }}>
                        {userRate >= 1 ? <FaStar size={size} color="#ffd700" /> : <FaRegStar size={size} color="#ffd700" />}
                    </button>
                    <button type="button" className="" onClick={() => { setUserRate(2) }}>
                        {userRate >= 2 ? <FaStar size={size} color="#ffd700" /> : <FaRegStar size={size} color="#ffd700" />}
                    </button>
                    <button type="button" className="" onClick={() => { setUserRate(3) }}>
                        {userRate >= 3 ? <FaStar size={size} color="#ffd700" /> : <FaRegStar size={size} color="#ffd700" />}
                    </button>
                    <button type="button" className="" onClick={() => { setUserRate(4) }}>
                        {userRate >= 4 ? <FaStar size={size} color="#ffd700" /> : <FaRegStar size={size} color="#ffd700" />}
                    </button>
                    <button type="button" className="" onClick={() => { setUserRate(5) }}>
                        {userRate >= 5 ? <FaStar size={size} color="#ffd700" /> : <FaRegStar size={size} color="#ffd700" />}
                    </button>
                </p>
            </>
        )
    }

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