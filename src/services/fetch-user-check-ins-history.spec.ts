import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { FetchUserCheckInsHistoryService } from "./fetch-user-check-ins-history.service";
import { beforeEach, describe, expect, it } from "vitest";

let checkInsRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryService;

describe("Fetch User Check Ins History Service", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository();
        sut = new FetchUserCheckInsHistoryService(checkInsRepository);
    });

    it("shoud be able to fetch check-in history", async () => {
        await checkInsRepository.create({
            gym_id: "gym-1",
            user_id: "user-1"
        });

        await checkInsRepository.create({
            gym_id: "gym-2",
            user_id: "user-1"
        });

        const { checkIns } = await sut.execute({
            userId: "user-1",
            page: 1
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-1" }),
            expect.objectContaining({ gym_id: "gym-2" }),
        ]);
    });

    it("should be able to fetch paginated check-in history", async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: "user-1"
            });
        }

        const { checkIns } = await sut.execute({
            userId: "user-1",
            page: 2
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-21" }),
            expect.objectContaining({ gym_id: "gym-22" }),
        ])
    });
});