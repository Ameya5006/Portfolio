import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf("node_modules/lucide-react") !== -1) return "icons";
          if (
            id.indexOf("node_modules/react") !== -1 ||
            id.indexOf("node_modules/scheduler") !== -1
          ) return "react";
        },
      },
    },
  },
});
