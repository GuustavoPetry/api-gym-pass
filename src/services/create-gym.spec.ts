import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymService } from "./create-gym.service";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymService(gymsRepository);
    });

    it("should be able to create gym", async () => {
        const { gym } = await sut.execute({
            title: "Javascript Gym",
            description: null,
            phone: null,
            latitude: -26.6993392,
            longitude: -49.0847169
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});