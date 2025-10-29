import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // NUEVO: Ayuda con cache en dev para imports como el tuyo.
  optimizeDeps: {
    include: ['react', 'react-dom'], // Si usas externals.
  },
  // Opcional: Para prod, minify y sourcemaps.
  build: mode === 'production' ? {
    sourcemap: true, // Debug easier.
  } : {},
}));