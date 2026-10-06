import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // Registry source imports `@/lib/*` and `@/components/ui/*`; each file
        // resolves them through its nearest tsconfig, the registry's own.
        tsconfigPaths: true,
        // Registry files resolve bare imports from packages/registry, the
        // playground from here - two Reacts break every hook.
        dedupe: ["react", "react-dom"],
    },
});
