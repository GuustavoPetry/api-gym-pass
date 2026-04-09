import { SearchGymsService } from "./search-gyms.service";
import { describe, expect, it } from "vitest";
import { beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { object } from "zod";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsService(gymsRepository);
    });

    it("should be able to search for gyms", async () => {
        await gymsRepository.create({
            title: "Javascript Academy",
            description: "",
            phone: "",
            latitude: 0,
            longitude: 0,
        });

        await gymsRepository.create({
            title: "Typescript Academy",
            description: "",
            phone: "",
            latitude: 0,
            longitude: 0,
        });

        const { gyms } = await sut.execute({ query: "Academy", page: 1 });

        console.log(gyms)

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript Academy" }),
            expect.objectContaining({ title: "Typescript Academy" }),
        ]);
    });

    it("should be able to fetch paginated gyms search", async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Academy ${i}`,
                description: "",
                phone: "",
                latitude: 0,
                longitude: 0,
            });
        }

        const { gyms } = await sut.execute({
            query: "Javascript",
            page: 2
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript Academy 21" }),
            expect.objectContaining({ title: "Javascript Academy 22" }),
        ])
    });
});