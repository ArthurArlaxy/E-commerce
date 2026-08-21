import { addToCart, addToCartAndBuy } from "@/actions/cart"
import { getProductBySlug } from "@/actions/product"
import Button from "@/components/Button"
import ReviewCard from "@/components/Cards/ReviewCard"
import { ImageProductSection } from "@/components/ImageProductSection"
import StarRating from "@/components/StarRating"


export default async function ({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const result = await getProductBySlug(slug)


    if ("error" in result) {
        throw new Error("Falha ao tentar buscar os produtos")
    }

    const { product, totalReview } = result
    const totalStars = product.reviews.reduce((acc, review) => acc + review.rating, 0)
    const mediaReview = totalReview > 0 ? totalStars / totalReview : 0

    return (
        <main>
            <section className="product-main-section">
                <ImageProductSection product={product} />
                <div>
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-btn-container">
                        <Button text="Carrinho" action={addToCart.bind(null, product.id)} />
                        <Button text="Comprar" action={addToCartAndBuy.bind(null, product.id)} />
                    </div>
                </div>
            </section>
            <section className="product-description-container">
                <h2 className="product-subtitle">Descrição</h2>
                <p className="description">{product.description}</p>
            </section>
            <section className="review-container">
                <header className="header-review-container">
                    <StarRating rating={mediaReview} maxStars={5} size={20} />
                    <h2 className="product-subtitle">{`Avaliações (${mediaReview}/5)`}</h2>
                </header>
                {product.reviews.length ? product.reviews.map((review) => {
                    return <ReviewCard user={review.user.name} content={review.comment} rating={review.rating} createdAt={review.createdAt} key={review.id} />
                }) : <p>Nenhuma avaliação encontrada</p>}
            </section>
        </main>
    )
}