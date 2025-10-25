import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],

    server: {
        // 💡 Esta sección para la detección de cambios en Docker.
        watch: {
        usePolling: true,
        // Opcional: Ajustar el intervalo de polling (milisegundos).
        interval: 100 
        }
    }
})
