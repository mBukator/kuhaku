import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // `@/components/ui/*` maps to several category folders; only tsconfig
        // resolution follows all of them.
        tsconfigPaths: true,
        dedupe: ["react", "react-dom"],
    },
    test: {
        include: ["src/**/*.test.{ts,tsx}"],
        setupFiles: ["./test/setup.ts"],
        browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
        },
    },
});
