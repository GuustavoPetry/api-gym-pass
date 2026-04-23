import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function checkInsHistoryController(request: FastifyRequest, reply: FastifyReply) {
    const checkInsHistoryQuerySchema = z.object({
        page: z.number().min(1).default(1)
    });

    const { page } = checkInsHistoryQuerySchema.parse(request.query);

    const fetchUserCheckInsHistory = makeFetchUserCheckInsHistoryService();

    const { checkIns } = await fetchUserCheckInsHistory.execute({
        userId: request.user.sub,
        page
    });

    return reply.status(200).send({
        checkIns,
    });
}