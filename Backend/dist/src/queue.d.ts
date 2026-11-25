import { Queue } from "bullmq";
export declare const connection: {
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
    tls: {} | undefined;
};
export declare const paymentQueue: Queue<any, any, string, any, any, string, import("bullmq").RedisQueueBackend, import("bullmq").ConnectionOptions>;
//# sourceMappingURL=queue.d.ts.map