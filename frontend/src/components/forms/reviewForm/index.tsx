"use client"

import { createReview, ReviewState } from "@/actions/review"
import styles from "./styles.module.css"
import StarRating from "@/components/StarRating"
import { useActionState } from "react"


const initialState: ReviewState = {}

export function ReviewForm({ productId, slug }: { productId: string, slug: string }) {

    const [state, formActionHandler, isPending] = useActionState(createReview, initialState)

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Comentário</h2>
            <form action={formActionHandler} className={styles.commentBox}>
                <StarRating maxStars={5} rating={0} rate={true} />
                <input type="text" name="productId" hidden required value={productId} readOnly />
                <input type="text" name="slug" hidden required value={slug} readOnly />
                <textarea
                    name="comment"
                    className={styles.commentTextarea}
                    placeholder="Escreva um comentário sobre o pedido..."
                    rows={4}
                />
                {state ? <p>{state.error}</p> : null}
                <button disabled={isPending} type="submit" className={styles.commentButton}>
                    {isPending ? "Enviando" : "Enviar comentário"}
                </button>
            </form>
        </section>
    )
}

