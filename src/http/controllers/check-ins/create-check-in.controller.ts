import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createCheckInController(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.uuid()
    });

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
    const { gymId } = createCheckInParamsSchema.parse(request.params);

    const checkInService = makeCheckInService();

    await checkInService.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude
    });

    return reply.status(201).send();

}