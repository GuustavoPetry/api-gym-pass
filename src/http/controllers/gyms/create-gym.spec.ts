import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Create Gym (e2e)", () => {
    beforeAll(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms" CASCADE`);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create gym", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const payload = {
            title: "Petry Gym",
            description: "The best gym of Blumenau",
            phone: "5547996005016",
            latitude: -26.9271018,
            longitude: -49.1302912,
        }
        
        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send(payload);

        console.log(response.body);
        console.log(payload);

        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            ...payload,
        }));
        expect(response.statusCode).toEqual(201);

    });
});