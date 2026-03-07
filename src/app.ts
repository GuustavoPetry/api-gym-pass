import fastify from "fastify";
import { userRoutes } from "./http/routes/user.routes";

export const app = fastify();

app.register(userRoutes);
