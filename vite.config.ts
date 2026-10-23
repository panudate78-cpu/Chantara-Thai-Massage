import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@cms": path.resolve(__dirname, "cms"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // The public site and the admin panel are separate bundles: visitors
        // never download the CMS code, keeping the marketing site fast.
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin.html"),
      },
    },
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
