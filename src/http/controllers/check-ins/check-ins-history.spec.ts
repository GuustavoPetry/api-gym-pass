import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Check-ins History (e2e)", async () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms", "check_ins" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to get user check-ins history", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gymResponse = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Programmer Gym",
                description: "",
                phone: "",
                latitude: -26.7341808,
                longitude: -49.0890929,
            });

        const gymId = gymResponse.body.gym.id;

        await request(app.server)
            .post(`/gyms/${gymId}/check-ins`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                latitude: -26.7341808,
                longitude: -49.0890929,
            });

        const response = await request(app.server)
            .get("/check-ins/history")
            .set("Authorization", `Bearer ${token}`)
            .send();

        console.log(response.body);

        expect(response.statusCode).toEqual(200);
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                gym_id: gymId
            })
        ]);
    });
});