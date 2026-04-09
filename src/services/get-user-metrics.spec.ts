import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics.service";

let checkInsRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsService;

describe("Get User Metrics Service", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository();
        sut = new GetUserMetricsService(checkInsRepository);
    });

    it("should to get user check-ins count from metrics", async () => {
        for (let i = 0; i < 20; i++) {
            await checkInsRepository.create({
                gym_id: "gym-1",
                user_id: "user-1"
            });
        }

        const { checkInsCount } = await sut.execute({
            userId: "user-1"
        });

        expect(checkInsCount).toEqual(20);
    });
});