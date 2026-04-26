import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Validate Check-in", async () => {
    beforeEach(async () => {
        await app.ready();
    });

    beforeAll(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms", "check_ins" CASCADE`);

    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to validate check-in", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gymResponse = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Petry Gym",
                description: "",
                phone: "",
                latitude: -26.7341808,
                longitude: -49.0890929,
            });

        const gymId = gymResponse.body.gym.id;

        const checkInResponse = await request(app.server)
            .post(`/gyms/${gymId}/check-ins`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                latitude: -26.7341808,
                longitude: -49.0890929,
            });

        const checkInId = checkInResponse.body.checkIn.id;

        const validateResponse = await request(app.server)
            .patch(`/check-ins/${checkInId}/validate`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(validateResponse.statusCode).toEqual(201);
        expect(validateResponse.body.checkIn).toEqual(
            expect.objectContaining({
                id: checkInId,
                gym_id: gymId
            })
        );

    });

});