import { app } from "@/app";
import { beforeEach, describe, expect, it, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Authenticate (e2e)", () => {
    beforeEach(async () => {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users" CASCADE`);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to authenticate", async () => {

        const { token, statusCode } = await createAndAuthenticateUser(app);

        expect(statusCode).toEqual(200);
        expect(token).toEqual(expect.any(String));
    });
});