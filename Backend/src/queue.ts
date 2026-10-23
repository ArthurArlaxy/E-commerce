import { Queue } from "bullmq"

export const connection = {
    host: process.env.REDIS_HOST ?? 'redis',
    port: Number(process.env.REDIS_PORT ?? 6379)
}

export const paymentQueue = new Queue('payment', { connection })