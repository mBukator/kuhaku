import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // Registry files resolve `@/` imports through the registry's own tsconfig.
        tsconfigPaths: true,
        // Registry files resolve React from packages/registry; two Reacts break hooks.
        dedupe: ["react", "react-dom"],
    },
});
