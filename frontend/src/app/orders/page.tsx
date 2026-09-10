import { getOrder } from "@/actions/orders"
import { OrderCard } from "@/components/Cards/OrderCard"


export default async function Page() {

    const orders = await getOrder()

    if ("error" in orders) {
        return (
            <main className="pageContainer">
                <h1 className="title">Pedidos</h1>
                <p>{orders.error}</p>
            </main>
        )
    }

    return (
        <main className="pageContainer flex-colomn">
            <h1 className="title">Pedidos</h1>
            {orders.items.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                orders.items.map((order: any) => (
                    <OrderCard key={order.id} {...order} />
                ))
            )}
        </main>
    )
}