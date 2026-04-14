import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { AuthenticateService } from "../authenticate.service";

export function makeAuthenticateService() {
    const usersRepository = new PrismaUserRepository();
    const service = new AuthenticateService(usersRepository);

    return service;
}