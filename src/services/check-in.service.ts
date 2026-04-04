import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client"
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInServiceRequest {
    userId: string,
    gymId: string,
    userLatitude: number,
    userLongitude: number
}

interface CheckInServiceResponse {
    checkIn: CheckIn
}

export class CheckInService {
    constructor(
        private checkinRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) { }

    async execute({
        userId,
        gymId
    }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const checkInOnSameDate = await this.checkinRepository.findByUserIdOnDate(
            userId,
            new Date()
        );

        if (checkInOnSameDate) {
            throw new Error;
        }

        const checkIn = await this.checkinRepository.create({
            user_id: userId,
            gym_id: gymId
        });

        return {
            checkIn,
        }
    }
}