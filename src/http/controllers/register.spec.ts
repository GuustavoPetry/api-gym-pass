import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Register (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users" CASCADE`);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to register", async () => {
        const email = `${crypto.randomUUID()}@gmail.com`

        const response = await request(app.server)
            .post("/users")
            .send({
                name: "Gustavo Petry",
                email,
                password: "123456"
            });

        expect(response.statusCode).toEqual(201);
    });
});