import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Create Check In (e2e)", async () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms", "check_ins" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create check-in", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gym = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Petry Gym",
                description: "",
                phone: "",
                latitude: -26.7341808,
                longitude: -49.0890929,
            });

        const { id: gymId } = gym.body.gym;

        const response = await request(app.server)
            .post(`/gyms/${gymId}/check-ins`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                latitude: -26.7341808,
                longitude: -49.0890929,
            });

        expect(response.statusCode).toEqual(201);
        expect(response.body.checkIn).toEqual(
            expect.objectContaining({
                gym_id: gymId
            })
        );
    });
});