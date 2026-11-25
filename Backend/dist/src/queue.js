import { Queue } from "bullmq";
export const connection = {
    host: process.env.REDIS_HOST ?? "redis",
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined
};
export const paymentQueue = new Queue('payment', { connection });
//# sourceMappingURL=queue.js.map