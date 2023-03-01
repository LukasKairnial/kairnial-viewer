import { defineConfig } from "vite";

export default defineConfig({
    optimizeDeps: {
        include: ["bim-viewer"],
    },
    server: {
        port: 5173,
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes("@babylonjs")) {
                        const submodule = id.match(/@babylonjs\/([^\/]*)/)[1];
                        return `babylonjs-${submodule}`;
                    }
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
            },
        },
    },
});
