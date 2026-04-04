import { CheckInService } from "./check-in.service";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";


let checkinRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-in Service", () => {
    beforeEach(() => {
        checkinRepository = new InMemoryCheckInRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInService(checkinRepository, gymsRepository);

        gymsRepository.items.push({
            id: "gym-1",
            title: "JavaScript Gym",
            description: "",
            phone: "",
            latitude: new Decimal(0),
            longitude: new Decimal(0)
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check-in", async () => {
        const { checkIn } = await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -26.6993392,
            userLongitude: -49.0847169,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -26.6993392,
            userLongitude: -49.0847169
        });

        await expect(() =>
            sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -26.6993392,
                userLongitude: -49.0847169
            })
        ).rejects.toBeInstanceOf(Error);
    });

    it("should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -26.6993392,
            userLongitude: -49.0847169
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -26.6993392,
            userLongitude: -49.0847169
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
});