import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = makeGetUserProfileService();

    console.log("SUB:", request.user.sub);

    const { user } = await getUserProfile.execute({
        userId: request.user.sub,
    });

    return reply.status(200).send({
        user: {
            ...user,
            password_hash: undefined
        }
    });
}