import { CheckInService } from "./check-in.service";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";


let checkinRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-in Service", () => {
    beforeEach(async () => {
        checkinRepository = new InMemoryCheckInRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInService(checkinRepository, gymsRepository);

        await gymsRepository.create({
            id: "gym-1",
            title: "JavaScript Gym",
            description: "",
            phone: "",
            latitude: -26.6993392,
            longitude: -49.0847169
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
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
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

    it("should not be able to check in on distant gym", async () => {
        gymsRepository.items.push({
            id: "gym-2",
            title: "Typescript Gym",
            description: "",
            phone: "",
            latitude: Decimal(-26.7204199),
            longitude: Decimal(-49.1699432),
        });

        await expect(() =>
            sut.execute({
                gymId: "gym-2",
                userId: "user-1",
                userLatitude: -26.7251903,
                userLongitude: -49.1716426
            })
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });
});