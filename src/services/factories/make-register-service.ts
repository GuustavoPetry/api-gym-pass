import { PrismaUserRepository } from "@/repositories/prisma/prisma.user.repository";
import { RegisterService } from "../register.service";

export function makeRegisterService() {
    const usersRepository = new PrismaUserRepository();
    const registerService = new RegisterService(usersRepository);

    return registerService;
}