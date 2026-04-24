import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Create Gym (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create gym", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const payload = {
            title: "Petry Gym",
            description: "The best gym of Blumenau",
            phone: "5547996005016",
            latitude: -26.7341808,
            longitude: -49.0890929,
        }

        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send(payload);

        expect(response.statusCode).toEqual(201);
    });
});