import { makeFetchNearbyGyms } from "@/services/factories/make-fetch-nearby-gyms-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function nearbyGymsController(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

    const nearbyGymsService = makeFetchNearbyGyms();

    const { gyms } = await nearbyGymsService.execute({
        userLatitude: latitude,
        userLongitude: longitude
    });

    return reply.status(200).send({
        gyms,
    });
}