import { registerService } from "@/services/register.service";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6)
    });

    // throw error automático em caso de inconsistência na validação
    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        await registerService({
            name,
            email,
            password
        });

    } catch (err) {
        return reply.status(409).send();
    }

    return reply.status(201).send();

} 