import { FastifyInstance } from "fastify";
import { registerController } from "./controllers/register.controller";
import { authenticateController } from "./controllers/authenticate.controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/user", registerController);
    app.post("/sessions", authenticateController);
}