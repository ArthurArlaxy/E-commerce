
import { getUserAddress } from "@/actions/address"
import { getCart } from "@/actions/cart"
import { getShippings } from "@/actions/shipping"
import { ProductCartCard } from "@/components/Cards/ProductCartCard"
import { CartForm } from "@/components/forms/cartForm"
import styles from "./styles.module.css"

export default async function Page() {

    const cart = await getCart()
    const { items } = cart

    let addresses = await getUserAddress()
    if ("error" in addresses) {
        addresses = []
    }

    const shippings = await getShippings()

    return (
        <main>
            
                <h1 className="title">Carrinho</h1>
                <CartForm shippings={shippings} total={cart.total} selectedTotal={cart.selectedTotal} addresses={addresses}>

                <ul className="cartItemsContainer">
                    {items.length ? items.map((product) => (
                        <ProductCartCard
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            category={product.category}
                            price={product.price}
                            quantity={product.quantity}
                            selected={product.selected}
                            slug={product.slug}
                            maxStock={product.maxStock}
                            unavailable={product.unavailable}
                            key={product.id}
                        />
                    )) : <p>Nenhum produto no carrinho!</p>}
                </ul>
            </CartForm>
        </main>
    )
}