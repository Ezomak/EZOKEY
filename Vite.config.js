import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pour gérer les imports d'images SVG/PNG directement (optionnel)
import svgr from "vite-plugin-svgr";
// Pour les imports d'ABI JSON si tu veux faire : import abi from "./abi/EzKey_ERC721.abi.json";
import vitePluginRaw from "vite-plugin-raw";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    vitePluginRaw({
      match: /\.abi\.json$/,
    }),
  ],
  server: {
    port: 5173, // Port par défaut Vite
    open: true, // Ouvre le navigateur à dev
  },
  resolve: {
    alias: {
      // Exemples pour organiser tes imports
      "@components": "/src/components",
      "@abi": "/src/abi",
      "@config": "/src/config",
      "@utils": "/src/utils",
    },
  },
});
