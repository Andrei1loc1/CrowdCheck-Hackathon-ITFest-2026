// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from 'path'                    // ← adaugă asta

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')   // ← absolut, cu ./
        }
    },
    plugins: [
        react(),
        tailwindcss(),
    ],
})