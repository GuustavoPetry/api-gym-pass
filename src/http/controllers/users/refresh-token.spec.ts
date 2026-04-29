import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Refresh Token (e2e)", async () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users" CASCADE`);
    });

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to generate refresh token", async () => {
        const register = await request(app.server)
            .post("/users")
            .send({
                name: "Gustavo Petry",
                email: "ogustavopetry@gmail.com",
                password: "123456"
            });

        const authResponse = await request(app.server)
            .post("/sessions")
            .send({
                email: "ogustavopetry@gmail.com",
                password: "123456"
            });

        const cookies = authResponse.get("Set-Cookie");

        const refresh = await request(app.server)
            .patch("/token/refresh")
            .set("Cookie", cookies!)
            .send();

        expect(refresh.statusCode).toEqual(200);
        expect(refresh.body).toEqual(
            expect.objectContaining({
                token: expect.any(String)
            })
        );
        expect(refresh.get("Set-Cookie")).toEqual([
            expect.stringContaining("refreshToken=")
        ])
    });
});