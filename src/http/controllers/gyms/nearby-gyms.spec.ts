import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Fetch Nearby Gyms (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    });

    it("should be able to list nearby gyms", async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const nearbyGym = {
            title: "Nearby Gym",
            description: "",
            phone: "",
            latitude: -26.9257987,
            longitude: -49.1219981
        };

        const distantGym = {
            title: "Distant Gym",
            description: "",
            phone: "",
            latitude: -26.7341808,
            longitude: -49.0890929,
        };

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                ...nearbyGym
            })

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                ...distantGym
            });

        const response = await request(app.server)
            .get("/gyms/nearby")
            .query({
                latitude: -26.9271018,
                longitude: -49.1302912,
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining(
                { title: "Nearby Gym" },
            )
        ])
    });
});