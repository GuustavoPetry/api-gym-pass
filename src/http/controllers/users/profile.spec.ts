import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Profile (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users" CASCADE`);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to get user profile", async () => {
        const { token, email } = await createAndAuthenticateUser(app);

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