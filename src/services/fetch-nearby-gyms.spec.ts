import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms.service";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe("Fetch Nearby Gyms Service", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsService(gymsRepository);
    });

    it("should be able to fetch nearby gyms", async () => {
        await gymsRepository.create({
            title: "Near Gym",
            description: "",
            phone: "",
            latitude: -26.7999351,
            longitude: -49.1083131,
        });

        await gymsRepository.create({
            title: "Far Gym",
            description: "",
            phone: "",
            latitude: -26.9822211,
            longitude: -49.1098491,
        });

        const { gyms } = await sut.execute({
            userLatitude: -26.8383486,
            userLongitude: -49.113713,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Near Gym" }),
        ]);
    });
});