import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { randomUUID } from "node:crypto";

describe("Search Gyms (e2e)", () => {
    beforeAll(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms" CASCADE`);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to search gyms by name", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gymNames = ["JavaScript Gym", "TypeScript Gym", "Dart Gym", "Anti-Frontend Gym"];

        const query = "Frontend";

        for (const gym of gymNames) {
            await request(app.server)
                .post("/gyms")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: gym,
                    description: `The best ${gym}`,
                    phone: randomUUID(),
                    latitude: -26.9271018,
                    longitude: -49.1302912,
                });

            console.log(gym);
        }

        const response = await request(app.server)
            .get("/gyms/search")
            .query({
                query,
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        console.log(response.body)


        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: `Anti-${query} Gym`
            })
        ]);

    });
});