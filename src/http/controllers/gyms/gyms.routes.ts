import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { searchGymsController } from "./search-gyms.controller";
import { nearbyGymsController } from "./nearby-gyms.controller";
import { createGymController } from "./create-gym.controller";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/gyms/search", searchGymsController);
    app.get("/gyms/nearby", nearbyGymsController);
    
    app.post("/gyms", createGymController);
}