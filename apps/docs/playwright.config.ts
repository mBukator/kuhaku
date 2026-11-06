import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const IS_CI = process.env.CI !== undefined;

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.spec.ts",
    forbidOnly: IS_CI,
    retries: IS_CI ? 1 : 0,
    reporter: IS_CI ? [["github"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "retain-on-failure",
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    // The production build, not the dev server: turbo runs docs#build first.
    webServer: {
        command: `bun run start --port ${PORT}`,
        url: `http://localhost:${PORT}/docs/components/button`,
        reuseExistingServer: false,
    },
});
