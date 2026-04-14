import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInService } from "../check-in.service";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeCheckInService() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const gymsRepository = new PrismaGymsRepository();
    const service = new CheckInService(checkInsRepository, gymsRepository);

    return service;
}