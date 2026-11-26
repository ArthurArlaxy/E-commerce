import { Worker } from "bullmq"
import { connection, paymentQueue } from "./queue.js"
import { OrderPrisma } from "./Repository/prisma/OrderPrisma.js"

const orders = new OrderPrisma()

// O Worker só fica ativo em janelas curtas para economizar comandos no Redis.
// O BullMQ limita a espera bloqueante a 10 s, então um Worker contínuo gasta ~2M comandos/mês.
const WINDOW_MS = 25_000
const CYCLE_MS = 180_000 

// Menor que o ciclo, para o job sempre estar vencido quando a próxima janela abrir
const CHECK_INTERVAL_MS = CYCLE_MS - 60_000

async function getPixStatus(paymentId: string): Promise<string> {
    const response = await fetch(
        `https://api.abacatepay.com/v2/transparents/check?id=${encodeURIComponent(paymentId)}`,
        {
            headers: { Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}` },
            signal: AbortSignal.timeout(30_000)
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
    { every: CYCLE_MS },
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
}, {
    connection,
    autorun: false,           
    skipStalledCheck: true,   
    lockDuration: 120_000,
    concurrency: 1
})

worker.on('failed', (job, err) => console.error(`Job ${job?.name} (${job?.id}) falhou:`, err.message))
worker.on('error', (err) => console.error('Erro no worker:', err.message))

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

let closing = false
let started = false

async function cycleLoop() {
    while (!closing) {
        try {
            if (!started) {
                started = true
                worker.run().catch(err => console.error('Worker parou', err))
            } else {
                await worker.resume()
            }

            await sleep(WINDOW_MS)
            await worker.pause()                // espera o job em andamento terminar
            await sleep(CYCLE_MS - WINDOW_MS)
        } catch (error) {
            console.error('Falha no ciclo do worker', error)
            await sleep(CYCLE_MS)
        }
    }
}

cycleLoop()

export async function closeWorker() {
    closing = true
    await worker.close()
    await paymentQueue.close()
}

if (process.env.RUN_WORKER_INSIDE_API !== "true") {
    const shutdown = async () => {
        await closeWorker()
        process.exit(0)
    }
    process.on("SIGTERM", shutdown)
    process.on("SIGINT", shutdown)
}
console.log('Worker iniciado', process.pid)