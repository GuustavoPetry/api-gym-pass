import { config } from "dotenv";
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