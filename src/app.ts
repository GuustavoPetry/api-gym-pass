import fastify from "fastify";
import { userRoutes } from "./http/routes";
import { z, ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(userRoutes);

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
