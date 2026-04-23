import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createCheckInController } from "./create-check-in.controller";
import { validateCheckInController } from "./validate-check-in.controller";
import { checkInsMetricsController } from "./check-ins-metrics.controller";
import { checkInsHistoryController } from "./check-ins-history.controller";

export function checkInsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/check-ins/history", checkInsHistoryController);
    app.get("/check-ins/metrics", checkInsMetricsController);

    app.post("/gyms/:gymId/check-ins", createCheckInController);
    
    app.patch("/check-ins/:checkInId/validate", validateCheckInController);
}