import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetUserProfileService } from "../get-user-profile.service";

export function makeGetUserProfileService() {
    const usersRepository = new PrismaUserRepository();
    const service = new GetUserProfileService(usersRepository);

    return service;
}