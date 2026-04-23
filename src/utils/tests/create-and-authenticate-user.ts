import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
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

    const statusCode = authResponse.statusCode;

    return {
        token,
        email,
        statusCode
    };
}