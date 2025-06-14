import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [ tailwindcss(),react()],
    server: {
      proxy: {
        // cualquier /api/XYZ lo redirige al BACKEND
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};