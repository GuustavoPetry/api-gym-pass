import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Profile (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users" CASCADE`);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to get user profile", async () => {
        const email = `${crypto.randomUUID()}@gmail.com`

        await request(app.server).post("/users").send({
            name: "Gustavo Petry",
            email,
            password: "123456"
        });

        const authResponse = await request(app.server).post("/sessions").send({
            email,
            password: "123456"
        });

        const { token } = authResponse.body;

        const profileResponse = await request(app.server)
            .get("/me")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(profileResponse.statusCode).toEqual(200);
        expect(profileResponse.body.user).toEqual(
            expect.objectContaining(
                {
                    email,
                }
            ));
    });
})