import { config } from "dotenv";
import { execSync } from "node:child_process";
import { Client } from "pg";
import type { Environment } from "vitest/environments";

config({ path: ".env.test", override: true });

export default <Environment>{
    name: "prisma",
    viteEnvironment: "ssr",
    async setup() {
        // aplica migrations no banco de teste
        execSync("npx prisma migrate deploy", {
            env: {
                ...process.env,
                DATABASE_URL: process.env.DATABASE_URL!,
            },
            stdio: "inherit",
        });

        return {
            async teardown() {
                // limpa todas as tabelas após cada arquivo de teste
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
                });

                await client.connect();
                await client.query(`
                    TRUNCATE TABLE users, check_ins, gyms RESTART IDENTITY CASCADE
                `);
                await client.end();
            },
        };
    },
};