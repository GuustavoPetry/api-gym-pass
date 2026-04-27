import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Check-ins Metrics (e2e)", async () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "gyms", "check_ins" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able get user check-ins metrics", async () => {
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


        const metricsResponse = await request(app.server)
            .get("/check-ins/metrics")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(metricsResponse.statusCode).toEqual(200);
        expect(metricsResponse.body.checkInsCount).toEqual(1);
        expect(metricsResponse.body).toEqual(
            expect.objectContaining({
                checkInsCount: 1
            })
        );
    });
});