import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import basicSsl from '@vitejs/plugin-basic-ssl'

// HTTPS en desarrollo: evita el aviso de Chrome sobre
// formularios inseguros (datos de tarjeta) y habilita el
// autocompletado. Certificado autofirmado: el navegador pide
// aceptarlo una única vez en https://localhost:5173
export default defineConfig({
  server: {
    https: true,
    proxy: {
      // Redirige las peticiones /api hacia la API local.
      // Evita el bloqueo de mixed content en Chrome (HTTPS → HTTP).
      "/api": {
        target: "http://localhost:5209",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5209",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    basicSsl(),
  ],
})
