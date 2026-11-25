import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./router.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
const PORT = process.env.PORT || 5000;
// server.ts
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
let closeWorker;
if (process.env.RUN_WORKER_INSIDE_API === "true") {
    const workerModule = await import("./worker.js");
    closeWorker = workerModule.closeWorker;
}
const shutdown = () => {
    setTimeout(() => process.exit(1), 10_000).unref();
    httpServer.close(async () => {
        await closeWorker?.();
        process.exit(0);
    });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
//# sourceMappingURL=server.js.map