import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        preserveSymlinks: true,
        alias: {
            "@": path.resolve(process.cwd(), "./src"),
        }
    },
    server: {
        port: 3000,
        strictPort: true
    },
    build: {
        outDir: "../SimpleBudget.API/wwwroot",
    },
})