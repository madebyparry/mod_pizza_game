import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/mod_pizza_game/dist",
  build: {
    outDir: "/var/www/html/mod_pizza_game/dist/",
    emptyOutDir: true,
    assetDir: "/var/www/html/mod_pizza_game/dist/assets/",
    manifest: "manifest.json",
    sourcemap: true,
  },
});
