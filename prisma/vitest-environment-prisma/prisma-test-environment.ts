import { env } from "@/env";
import { config } from "dotenv";
import { execSync } from "node:child_process";
import type { Environment } from "vitest/environments";

config({ path: ".env.test" });

export default <Environment>{
    name: "prisma",
    viteEnvironment: "ssr",
    async setup() {
        return {
            async teardown() { },
        };
    },
};