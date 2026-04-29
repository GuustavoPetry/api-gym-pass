import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./http/controllers/users/user.routes";
import { z, ZodError } from "zod";
import { env } from "./env";
import { gymsRoutes } from "./http/controllers/gyms/gyms.routes";
import { checkInsRoutes } from "./http/controllers/check-ins/check-ins.routes";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: "refreshToken",
        signed: false
    },
    sign: {
        expiresIn: "10m"
    }
});

app.register(fastifyCookie);

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error.", issues: z.treeifyError(error) });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // TODO: fazer log para uma ferramenta externa como Datadog/NewRelic/Sentry (Observabilidade);
    }

    return reply.status(500).send({ error: "Internal server error" });
});
