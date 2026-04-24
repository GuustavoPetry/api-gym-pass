import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import request from "supertest";

describe("Search Gyms (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    });

    it("should be able to search gyms by name", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gymNames = ["JavaScript Gym", "TypeScript Gym", "Dart Gym", "Anti-Frontend Club"];

        const query = "Frontend";

        for (const gym of gymNames) {
            await request(app.server)
                .post("/gyms")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: gym,
                    description: `The best ${gym}`,
                    phone: randomUUID(),
                    latitude: -26.7341808,
                    longitude: -49.0890929,
                });
        }

        const response = await request(app.server)
            .get("/gyms/search")
            .query({
                query,
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: `Anti-${query} Club`
            })
        ]);

    });
});