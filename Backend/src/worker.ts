import { Worker } from "bullmq"
import { connection, paymentQueue } from "./queue.js"
import { OrderPrisma } from "./Repository/prisma/OrderPrisma.js"

const orders = new OrderPrisma()
const CHECK_INTERVAL_MS = 20_000

async function getPixStatus(paymentId: string): Promise<string> {
    const response = await fetch(
        `https://api.abacatepay.com/v2/transparents/check?id=${encodeURIComponent(paymentId)}`,
        {
            headers: { Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}` },
            signal: AbortSignal.timeout(10_000)
        }
    )

    const body = await response.json().catch(() => null)

    if (!response.ok || !body?.data?.status) {
        throw new Error(`Falha ao consultar o PIX ${paymentId}`)
    }

    return body.data.status
}

async function checkPayment(orderId: string): Promise<boolean> {
    const order = await orders.getOrderPayment(orderId)

    if (!order || order.status !== 'pending') return true

    if (order.paymentId) {
        const status = await getPixStatus(order.paymentId)

        if (status === 'PAID') {
            await orders.markAsPaid(orderId)
            console.log(`Pedido ${orderId} pago`)
            return true
        }

        if (status === 'EXPIRED' || status === 'CANCELLED') {
            await orders.cancelIfUnpaid(orderId)
            console.log(`Pedido ${orderId} cancelado: PIX ${status}`)
            return true
        }
    }

    const expireAt = order.paymentExpireAt ?? new Date(order.createdAt.getTime() + 40 * 60_000)

    if (expireAt < new Date()) {
        await orders.cancelIfUnpaid(orderId)
        console.log(`Pedido ${orderId} cancelado: prazo vencido sem pagamento`)
        return true
    }

    return false
}

async function sweepExpired() {
    const ids = await orders.getExpiredPendingOrderIds()

    for (const id of ids) {
        try {
            await checkPayment(id)
        } catch (error) {
            console.error(`Sweep: falha ao checar o pedido ${id}`, error)
        }
    }
}

await paymentQueue.upsertJobScheduler(
    'sweep-expired',
    { every: 60_000 },
    { name: 'sweep-expired', opts: { removeOnComplete: true, removeOnFail: 20 } }
)

const worker = new Worker('payment', async (job) => {
    switch (job.name) {
        case 'check-payment': {
            const { orderId } = job.data
            let resolved = false

            try {
                resolved = await checkPayment(orderId)
            } catch (error) {
                console.error(`Falha ao checar o pedido ${orderId}, tentando de novo`, error)
            }

            if (!resolved) {
                await paymentQueue.add('check-payment', { orderId }, { delay: CHECK_INTERVAL_MS, removeOnComplete: true })
            }
            break
        }
        case 'sweep-expired':
            return sweepExpired()
        default:
            console.warn(`Job desconhecido: ${job.name}`)
    }
}, { connection })

worker.on('failed', (job, err) => console.error(`Job ${job?.name} (${job?.id}) falhou:`, err.message))

const shutdown = async () => {
    await worker.close()
    process.exit(0)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

console.log('Worker iniciado')