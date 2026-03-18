import { PrismaUserRepository } from "@/repositories/prisma/prisma.user.repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { RegisterService } from "@/services/register.service";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6)
    });

    // throw error automático em caso de inconsistência na validação
    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const usersRepository = new PrismaUserRepository();
        const registerService = new RegisterService(usersRepository);

        await registerService.execute({
            name,
            email,
            password
        });

    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                error: err.message
            });
        }

        throw err;
    }

    return reply.status(201).send();

} 