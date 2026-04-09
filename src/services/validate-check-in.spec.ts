import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInService } from "./validate-check-in.service";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInService;

describe("Validade Check-in Service", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository();
        sut = new ValidateCheckInService(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to validate the check-in", async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-1",
            user_id: "user-1"
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0]?.validated_at).toEqual(expect.any(Date));
    });

    it("should not be able to validated an inexistent check-in", async () => {
        expect(() =>
            sut.execute({
                checkInId: "inexistent-checkin-id"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
        vi.setSystemTime(new Date(1999, 2, 9, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-1",
            user_id: "user-1",
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21
        vi.advanceTimersByTime(twentyOneMinutesInMs);

        expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError);
    });

});