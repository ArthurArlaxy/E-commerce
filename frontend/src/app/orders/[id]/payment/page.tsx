import { notFound } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { PaymentPoller } from "./PaymentPoller"
import { getOrderById } from "@/actions/orders"
import { CopyButton } from "./CopyButton"
import styles from "./styles.module.css"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrderById(id)

    const shortId = order.id.slice(0, 8).toUpperCase()

    // Cancelado ou expirado
    if (order.status === "cancelled") {
        return (
            <main className={styles.container}>
                <section className={styles.card}>
                    <XCircle size={56} className={styles.iconError} />
                    <h1 className={styles.title}>PIX expirado</h1>
                    <p className={styles.subtitle}>
                        O pedido #{shortId} foi cancelado porque o pagamento não foi confirmado a tempo.
                    </p>
                    <Link href="/cart" className={styles.linkButton}>Voltar ao carrinho</Link>
                </section>
            </main>
        )
    }

    // Pago (qualquer status diferente de pending e cancelled)
    if (order.status !== "pending") {
        const paidAt = order.paymentPaidAt
            ? new Date(order.paymentPaidAt).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                dateStyle: "short",
                timeStyle: "short"
            })
            : null

        return (
            <main className={styles.container}>
                <section className={styles.card}>
                    <CheckCircle2 size={56} className={styles.iconSuccess} />
                    <h1 className={styles.title}>Pagamento confirmado!</h1>
                    <p className={styles.subtitle}>Recebemos o seu PIX e já estamos preparando o pedido.</p>

                    <dl className={styles.summary}>
                        <div>
                            <dt>Pedido</dt>
                            <dd>#{shortId}</dd>
                        </div>
                        <div>
                            <dt>Total</dt>
                            <dd>{Number(order.total)}</dd>
                        </div>
                        {paidAt && (
                            <div>
                                <dt>Pago em</dt>
                                <dd>{paidAt}</dd>
                            </div>
                        )}
                    </dl>

                    <Link href={`/orders/${order.id}`} className={styles.linkButton}>Ver detalhes do pedido</Link>
                    <Link href="/" className={styles.linkSecondary}>Continuar comprando</Link>
                </section>
            </main>
        )
    }

    // Pendente
    if (!order.paymentBrCode) notFound()

    const expireTime = new Date(order.paymentExpireAt).toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit"
    })

    return (
        <main className={styles.container}>
            <section className={styles.card}>
                <h1 className={styles.title}>Pague com PIX</h1>
                <p className={styles.subtitle}>Escaneie o QR Code ou copie o código</p>

                <div className={styles.qr}>
                    <QRCodeSVG value={order.paymentBrCode} size={220} />
                </div>

                <p className={styles.expire}>
                    Expira às <strong>{expireTime}</strong>
                </p>

                <code className={styles.code}>{order.paymentBrCode}</code>

                <CopyButton text={order.paymentBrCode} />

                <p className={styles.hint}>Esta página atualiza sozinha quando o pagamento for confirmado.</p>
                <PaymentPoller />
            </section>
        </main>
    )
}