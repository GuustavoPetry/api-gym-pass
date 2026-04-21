import request from "supertest";
import { app } from "@/app";
import { beforeEach, describe, expect, it, afterAll } from "vitest";

describe("Authenticate (e2e)", () => {
    beforeEach(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to authenticate", async () => {
        await request(app.server).post("/users").send({
            name: "Gustavo Petry",
            email: "gustavo.dev@gmail.com",
            password: "123456"
        });

        const authenticate = await request(app.server).post("/sessions").send({
            email: "gustavo.dev@gmail.com",
            password: "123456"
        });

        expect(authenticate.statusCode).toEqual(200);
        expect(authenticate.body).toEqual({
            token: expect.any(String),
        });
    });
});