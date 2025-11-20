import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// 🚀 Clean Vite config without componentTagger or lovable-tagger
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },

  plugins: [
    react(), // Only the React plugin
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
